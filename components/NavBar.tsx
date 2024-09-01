"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import { GithubIcon } from "./Icons";

import { ThemeSwitch } from "./ThemeSwitch";

export default function NavBar() {
  return (
    <Navbar className="w-full">
      <NavbarBrand>
        <div className="bg-gradient-to-br from-sky-300 to-indigo-500 bg-clip-text ml-4">
          <p className="text-xl font-semibold text-transparent">
            Interactive CWMA (Chat with my Avatar) Demo based on HeyGen SDK
          </p>
        </div>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem className="flex flex-row items-center gap-4">
          <Link
            isExternal
            aria-label="Github"
            href="https://github.com/mbarnig/InteractiveAvatarNextJSDemo.git"
            className="flex flex-row gap-1 justify-center text-foreground"
          >
            <GithubIcon className="text-default-500" />
            Github
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
