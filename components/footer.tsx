import { Github, Twitter, Linkedin, Brain, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/princemothkuri", label: "GitHub" },
    { icon: Mail, href: "mailto:princemothkuri@gmail.com", label: "Mail" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/mothkuri-prince-ba689922a", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-row gap-1">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="font-bold mb-4">ChinniAI</h3>
            </div>
            <p className="text-muted-foreground">
              Your intelligent companion for a more productive life.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-6 h-6" />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; 2024 ChinniAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
