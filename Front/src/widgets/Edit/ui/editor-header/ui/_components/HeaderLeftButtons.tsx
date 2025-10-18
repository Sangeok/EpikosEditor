"use client";

import { Menu, MoveLeft } from "lucide-react";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import Dropdown from "@/shared/ui/atoms/Dropdown/ui/Dropdown";
import { MenuItem } from "../../constants/MenuItem";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeaderLeftButtons() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-4">
      <IconButton onClick={handleMenuToggle}>
        <Menu size={18} />
        <Dropdown isOpen={isMenuOpen} setIsOpen={handleMenuToggle} dropdownItems={MenuItem} />
      </IconButton>

      <IconButton onClick={handleBackClick}>
        <MoveLeft size={18} />
      </IconButton>
    </div>
  );
}
