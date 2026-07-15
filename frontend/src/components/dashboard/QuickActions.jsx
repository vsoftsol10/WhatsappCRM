import {
  UserPlus,
  Users,
  Megaphone,
  ClipboardPlus,
  MessageCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Customer",
      description: "Create a new customer",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-100",
      route: "/customers",
    },
    {
      title: "Create Lead",
      description: "Add a new sales lead",
      icon: Users,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      route: "/leads",
    },
    {
      title: "Create Campaign",
      description: "Launch a WhatsApp campaign",
      icon: Megaphone,
      color: "text-purple-600",
      bg: "bg-purple-100",
      route: "/campaigns",
    },
    {
      title: "Create Task",
      description: "Assign a task",
      icon: ClipboardPlus,
      color: "text-green-600",
      bg: "bg-green-100",
      route: "/tasks",
    },
    {
      title: "Conversations",
      description: "Open inbox",
      icon: MessageCircle,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      route: "/conversations",
    },
    {
      title: "Templates",
      description: "Manage templates",
      icon: FileText,
      color: "text-pink-600",
      bg: "bg-pink-100",
      route: "/templates",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Background Decoration */}
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-100 blur-3xl opacity-60"></div>

      {/* Header */}
      <div className="relative mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Jump directly to the most common CRM actions.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.route)}
              className="
                group
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:border-blue-200
                hover:shadow-md
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bg}`}
                >
                  <Icon
                    size={24}
                    className={action.color}
                  />
                </div>

                <div className="text-left">

                  <h3 className="font-semibold text-gray-900">
                    {action.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>

                </div>

              </div>

              <ArrowRight
                size={18}
                className="
                  text-gray-400
                  transition-all
                  duration-300
                  group-hover:text-blue-600
                  group-hover:translate-x-1
                "
              />

            </button>
          );
        })}

      </div>

    </div>
  );
}