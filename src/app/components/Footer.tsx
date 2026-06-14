import {
  Camera,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { useLocation, useNavigate, Link } from "react-router-dom";
import type { MouseEvent } from "react";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashNavigation = (
    e: MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    e.preventDefault();

    if (location.pathname === "/") {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/");

    setTimeout(() => {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  const footerTitleClass =
    "relative w-fit text-foreground text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-6 pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-14 after:h-[2px] after:bg-secondary";

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/",
      icon: Instagram,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/",
      icon: Youtube,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/6281314342077",
      icon: MessageCircle,
    },
  ];

  const quickLinks = [
    {
      label: "Katalog",
      hash: "#katalog",
    },
    {
      label: "Kategori",
      hash: "#kategori",
    },
    {
      label: "Cara Sewa",
      hash: "#cara-sewa",
    },
  ];

  const gearCategories = [
    "Mirrorless",
    "Cinema Camera",
    "Lens",
    "Audio",
    "Lighting",
  ];

  return (
    <footer
      id="kontak"
      className="relative border-t-2 border-foreground bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand & Socials */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary shadow-[4px_4px_0px_0px_rgba(61,35,35,1)] sm:h-12 sm:w-12">
                <Camera className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>

              <span className="text-lg font-black uppercase italic tracking-tighter text-foreground sm:text-2xl">
                ReadyToSh0t
              </span>
            </div>

            <p className="text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
              Platform rental kamera dan peralatan profesional dengan estetika
              retro untuk content creator JABODETABEK.
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-card text-foreground transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-secondary hover:shadow-[4px_4px_0px_0px_rgba(61,35,35,1)] sm:h-10 sm:w-10"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={footerTitleClass}>Quick Links</h4>

            <ul className="space-y-2 text-xs font-bold uppercase sm:space-y-3 sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.hash}>
                  <a
                    href={item.hash}
                    className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                    onClick={(e) => handleHashNavigation(e, item.hash)}
                  >
                    <span className="h-[2px] w-0 bg-primary transition-all group-hover:w-2" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={footerTitleClass}>Gear</h4>

            <ul className="space-y-2 text-xs font-bold uppercase sm:space-y-3 sm:text-sm">
              {gearCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/catalog?category=${encodeURIComponent(cat)}`}
                    className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="h-[2px] w-0 bg-primary transition-all group-hover:w-2" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={footerTitleClass}>Kontak</h4>

            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />

                <span className="text-[11px] font-medium leading-relaxed text-muted-foreground sm:text-sm">
                  Mutiara Gading Timur Blok G10 No.18, RT.006/RW.033,
                  <br />
                  Kec. Mustika Jaya, Kota Bks, Jawa Barat 17158
                </span>
              </li>

              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />

                <a
                  href="tel:+6281314342077"
                  className="text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                >
                  +62 813-1434-2077
                </a>
              </li>

              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />

                <a
                  href="mailto:mahardikapardosi21@gmail.com"
                  className="break-all text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                >
                  mahardikapardosi21@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t-2 border-dashed border-foreground/20 pt-6 sm:mt-16 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
              © 2026 ReadyToSh0t. Est. 2024.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-8">
              {["Privacy", "Terms", "Cookies"].map((text) => (
                <a
                  key={text}
                  href="#"
                  className="text-[9px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:text-[10px]"
                >
                  {text} Policy
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}