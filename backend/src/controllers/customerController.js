const prisma = require("../config/prisma");
const { validateCustomer } = require("../validations/customerValidation");
const { normalizeIndianPhone } = require("../utils/phoneUtils");
const { recordAuditLog } = require("../services/auditLogService");
const XLSX = require("xlsx");

const createCustomer = async (req, res) => {
  try {
    const validation = validateCustomer(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { name, phone, email, company, source, requirements, status } = req.body;

    //console.log("req.user:", req.user);

    const normalizedPhone = normalizeIndianPhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number.",
      });
    }

    const { userId } = req.user;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: normalizedPhone,
        email,
        company,
        source,
        requirements,
        status,
        userId,
      },
    });

    await recordAuditLog({
      action: "CUSTOMER_CREATED",
      entityType: "Customer",
      entityId: customer.id,
      details: `${customer.name} (${customer.phone})`,
      actorId: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;

    const where = {}

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Search by name, phone, or email
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Backward compatible: no `page` param → return every matching
    // row like before (used by the dashboard KPI cards, which need
    // the full set to compute counts). Passing `page` switches to
    // real server-side pagination instead of fetching everything and
    // slicing it client-side.
    if (!page) {
      const customers = await prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        customers,
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.customer.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const validation = validateCustomer(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const { name, phone, email, company, source, requirements, status } = req.body;

    // Track what actually changed for a readable audit entry (same
    // pattern as EMPLOYEE_UPDATED in employeeController.js).
    const changes = [];
    if (name !== undefined && name !== existingCustomer.name) {
      changes.push(`name: ${existingCustomer.name} -> ${name}`);
    }
    if (phone !== undefined && phone !== existingCustomer.phone) {
      changes.push(`phone: ${existingCustomer.phone} -> ${phone}`);
    }
    if (email !== undefined && email !== existingCustomer.email) {
      changes.push(`email: ${existingCustomer.email} -> ${email}`);
    }
    if (company !== undefined && company !== existingCustomer.company) {
      changes.push(`company: ${existingCustomer.company} -> ${company}`);
    }
    if (status !== undefined && status !== existingCustomer.status) {
      changes.push(`status: ${existingCustomer.status} -> ${status}`);
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        name,
        phone,
        email,
        company,
        source,
        requirements,
        status,
      },
    });

    if (changes.length > 0) {
      await recordAuditLog({
        action: "CUSTOMER_UPDATED",
        entityType: "Customer",
        entityId: updatedCustomer.id,
        details: `${existingCustomer.name}: ${changes.join(", ")}`,
        actorId: req.user?.userId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check if customer has any tickets
    const ticket = await prisma.ticket.findFirst({
      where: {
        customerId: id,
      },
    });

    if (ticket) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete customer. Delete associated tickets first.",
      });
    }

    // Check if customer has any deals (Deal.customer has no cascade
    // delete, so without this check the prisma.customer.delete below
    // would throw a raw foreign-key error instead of a clean message)
    const deal = await prisma.deal.findFirst({
      where: {
        customerId: id,
      },
    });

    if (deal) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete customer. Delete associated deals first.",
      });
    }

    // Find customer's conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        customerId: id,
      },
    });

    // Delete messages first, then conversation
    if (conversation) {
      await prisma.message.deleteMany({
        where: {
          conversationId: conversation.id,
        },
      });

      await prisma.conversation.delete({
        where: {
          id: conversation.id,
        },
      });
    }

    // Delete customer
    await prisma.customer.delete({
      where: {
        id,
      },
    });

    await recordAuditLog({
      action: "CUSTOMER_DELETED",
      entityType: "Customer",
      entityId: id,
      details: `${existingCustomer.name} (${existingCustomer.phone})`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= BULK IMPORT: shared helpers =================

// Recognized column headers, case/space-insensitive, mapped to our
// Customer fields. Lets the customer's CSV/XLSX use slightly different
// header wording (e.g. "Mobile" or "Phone Number") without failing.
const HEADER_ALIASES = {
  name: "name",
  "customer name": "name",
  "full name": "name",
  phone: "phone",
  "phone number": "phone",
  mobile: "phone",
  "mobile number": "phone",
  email: "email",
  "email address": "email",
  company: "company",
  organisation: "company",
  organization: "company",
  source: "source",
  requirements: "requirements",
  requirement: "requirements",
  notes: "requirements",
};

const MAX_IMPORT_ROWS = 5000;

// Parses the uploaded file buffer (CSV or XLSX — XLSX.read handles both
// uniformly) into an array of plain objects keyed by OUR field names,
// regardless of the exact header wording in the file.
const parseImportFile = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const firstSheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[firstSheetName];

  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rawRows.map((rawRow) => {
    const row = {};

    for (const [rawHeader, value] of Object.entries(rawRow)) {
      const canonical =
        HEADER_ALIASES[rawHeader.trim().toLowerCase()] || null;

      if (canonical) {
        row[canonical] = String(value ?? "").trim();
      }
    }

    return row;
  });
};

// Runs the exact same validation single-customer create uses, plus
// duplicate detection (against the DB and against earlier rows in the
// same file). Returns { ready, duplicates, invalid } — nothing is
// written to the DB here.
const analyzeImportRows = async (rawRows) => {
  const ready = [];

  const duplicates = [];

  const invalid = [];

  const seenPhonesInFile = new Map(); // normalizedPhone -> rowNumber

  // First pass: validate + normalize every row.
  const normalizedRows = rawRows.map((row, index) => {
    const rowNumber = index + 2; // +1 for 0-index, +1 for the header row

    const { name, phone, email, company, source, requirements } = row;

    const validation = validateCustomer({ name, phone });

    if (!validation.isValid) {
      return { rowNumber, row, error: validation.message };
    }

    const normalizedPhone = normalizeIndianPhone(phone);

    if (!normalizedPhone) {
      return {
        rowNumber,
        row,
        error: `Invalid Indian mobile number: "${phone}"`,
      };
    }

    return {
      rowNumber,
      row: { name, phone: normalizedPhone, email, company, source, requirements },
      error: null,
    };
  });

  const validRows = normalizedRows.filter((r) => !r.error);

  for (const r of normalizedRows) {
    if (r.error) {
      invalid.push({ rowNumber: r.rowNumber, data: r.row, reason: r.error });
    }
  }

  // Second pass: in-file duplicate detection (keep the first
  // occurrence as a normal candidate, flag the later ones).
  for (const r of validRows) {
    const existingRowNumber = seenPhonesInFile.get(r.row.phone);

    if (existingRowNumber) {
      invalid.push({
        rowNumber: r.rowNumber,
        data: r.row,
        reason: `Duplicate phone number within the file (also appears in row ${existingRowNumber})`,
      });

      continue;
    }

    seenPhonesInFile.set(r.row.phone, r.rowNumber);
  }

  const dedupedRows = validRows.filter(
    (r) => seenPhonesInFile.get(r.row.phone) === r.rowNumber
  );

  // Third pass: check against existing DB customers in ONE query
  // instead of one query per row.
  const phonesToCheck = dedupedRows.map((r) => r.row.phone);

  const existingCustomers = phonesToCheck.length
    ? await prisma.customer.findMany({
        where: { phone: { in: phonesToCheck } },
      })
    : [];

  const existingByPhone = new Map(existingCustomers.map((c) => [c.phone, c]));

  for (const r of dedupedRows) {
    const existing = existingByPhone.get(r.row.phone);

    if (existing) {
      duplicates.push({
        rowNumber: r.rowNumber,
        incoming: r.row,
        existingCustomer: existing,
      });
    } else {
      ready.push({ rowNumber: r.rowNumber, data: r.row });
    }
  }

  return { ready, duplicates, invalid };
};

// ================= BULK IMPORT: PREVIEW =================
// Parses + validates the uploaded file and returns a preview only —
// nothing is written to the database. The frontend shows this preview
// (ready / duplicates / invalid) and lets the customer decide what to
// do with duplicates before calling confirmBulkImport.
const previewBulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV or Excel file.",
      });
    }

    let rawRows;

    try {
      rawRows = parseImportFile(req.file.buffer);
    } catch (parseError) {
      console.error("Bulk import parse error:", parseError);

      return res.status(400).json({
        success: false,
        message:
          "Couldn't read that file. Please make sure it's a valid CSV or Excel file.",
      });
    }

    if (rawRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The file has no data rows.",
      });
    }

    if (rawRows.length > MAX_IMPORT_ROWS) {
      return res.status(400).json({
        success: false,
        message: `This file has ${rawRows.length} rows. Please split it into files of ${MAX_IMPORT_ROWS} rows or fewer.`,
      });
    }

    const { ready, duplicates, invalid } = await analyzeImportRows(rawRows);

    return res.status(200).json({
      success: true,
      data: {
        totalRows: rawRows.length,
        ready,
        duplicates,
        invalid,
      },
    });
  } catch (error) {
    console.error("previewBulkImport error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing the file.",
    });
  }
};

// ================= BULK IMPORT: CONFIRM =================
// Actually writes to the database. Takes the already-reviewed row
// lists back from the frontend rather than re-uploading the file, so
// the customer's per-row duplicate decisions (skip vs update) are
// respected exactly. Every row is re-validated here too — never trust
// the client, even though the preview step already checked once.
const confirmBulkImport = async (req, res) => {
  try {
    const { toCreate = [], toUpdate = [] } = req.body;

    if (toCreate.length === 0 && toUpdate.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to import.",
      });
    }

    if (toCreate.length + toUpdate.length > MAX_IMPORT_ROWS) {
      return res.status(400).json({
        success: false,
        message: "Too many rows in a single import.",
      });
    }

    const { userId } = req.user;

    let createdCount = 0;

    let updatedCount = 0;

    const failedRows = [];

    // ---- Creates, in chunks (Prisma createMany doesn't return
    // individual row results, so we chunk mainly to keep each query a
    // reasonable size — not for per-row error detail here; per-row
    // validation already happened in analyzeImportRows). ----
    const CHUNK_SIZE = 500;

    for (let i = 0; i < toCreate.length; i += CHUNK_SIZE) {
      const chunk = toCreate.slice(i, i + CHUNK_SIZE);

      const validChunkRows = [];

      for (const item of chunk) {
        const data = item?.data || {};

        const validation = validateCustomer({
          name: data.name,
          phone: data.phone,
        });

        const normalizedPhone = normalizeIndianPhone(data.phone);

        if (!validation.isValid || !normalizedPhone) {
          failedRows.push({
            rowNumber: item?.rowNumber,
            data,
            reason: !validation.isValid
              ? validation.message
              : "Invalid Indian mobile number",
          });

          continue;
        }

        validChunkRows.push({
          name: data.name,
          phone: normalizedPhone,
          email: data.email || null,
          company: data.company || null,
          source: data.source || null,
          requirements: data.requirements || null,
          status: "ACTIVE",
          userId,
        });
      }

      if (validChunkRows.length === 0) continue;

      try {
        const result = await prisma.customer.createMany({
          data: validChunkRows,
          skipDuplicates: true, // safety net against a race with another
          // concurrent import, since phone is a unique column
        });

        createdCount += result.count;
      } catch (chunkError) {
        console.error("Bulk import chunk create error:", chunkError);

        // Whole chunk failed for a reason other than duplicates —
        // record every row in it as failed rather than losing the
        // information silently.
        for (const row of chunk) {
          failedRows.push({
            rowNumber: row?.rowNumber,
            data: row?.data,
            reason: "Failed to save — please retry this row.",
          });
        }
      }
    }

    // ---- Updates (existing customers the user chose to update) ----
    for (const item of toUpdate) {
      const { existingCustomerId, data } = item || {};

      if (!existingCustomerId || !data) continue;

      const validation = validateCustomer({
        name: data.name,
        phone: data.phone,
      });

      const normalizedPhone = normalizeIndianPhone(data.phone);

      if (!validation.isValid || !normalizedPhone) {
        failedRows.push({
          rowNumber: item?.rowNumber,
          data,
          reason: !validation.isValid
            ? validation.message
            : "Invalid Indian mobile number",
        });

        continue;
      }

      try {
        await prisma.customer.update({
          where: { id: existingCustomerId },
          data: {
            name: data.name,
            phone: normalizedPhone,
            email: data.email || null,
            company: data.company || null,
            source: data.source || null,
            requirements: data.requirements || null,
          },
        });

        updatedCount += 1;
      } catch (updateError) {
        console.error("Bulk import update error:", updateError);

        failedRows.push({
          rowNumber: item?.rowNumber,
          data,
          reason: "Failed to update — please retry this row.",
        });
      }
    }

    // One summary audit entry for the whole batch — not one per row.
    await recordAuditLog({
      action: "CUSTOMER_BULK_IMPORTED",
      entityType: "Customer",
      entityId: `bulk-${Date.now()}`,
      details: `${createdCount} created, ${updatedCount} updated, ${failedRows.length} failed`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Import complete",
      data: {
        created: createdCount,
        updated: updatedCount,
        failed: failedRows.length,
        failedRows,
      },
    });
  } catch (error) {
    console.error("confirmBulkImport error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while importing customers.",
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  previewBulkImport,
  confirmBulkImport,
};