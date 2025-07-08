import type { LayoutConfig } from "@/types";

interface FooterProps {
  footer: LayoutConfig["footer"];
}

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="bg-[#E8E8E8] dark:bg-gray-900 border-t  ">
      <div className="mx-auto px-4 sm:px-4 lg:px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500 dark:text-white">{footer.text}</div>
          <div className="flex space-x-6">
            {footer.links.map((link) => (
              <a
                key={link.route}
                href={link.route}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
