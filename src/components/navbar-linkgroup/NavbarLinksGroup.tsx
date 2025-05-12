/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavbarLinksGroup.module.css";

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  links,
}: LinksGroupProps) {
  const location = useLocation();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  // Check if current path matches this item or any of its children
  const isActive = link
    ? location.pathname === link
    : links?.some((subLink) => location.pathname === subLink.link);

  // Open the group automatically if a child is active
  useState(() => {
    if (
      !opened &&
      links?.some((subLink) => location.pathname === subLink.link)
    ) {
      setOpened(true);
    }
  });

  const items = (hasLinks ? links : []).map((subLink) => {
    const isSubLinkActive = location.pathname === subLink.link;

    return (
      <Text
        component={Link}
        to={subLink.link}
        className={`${classes.link} ${
          isSubLinkActive ? classes.linkActive : ""
        }`}
        key={subLink.label}
      >
        {subLink.label}
      </Text>
    );
  });

  return (
    <>
      {hasLinks ? (
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={`${classes.control} ${
            isActive ? classes.controlActive : ""
          }`}
        >
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon
                variant="light"
                size={30}
                className={isActive ? classes.themeIconActive : ""}
              >
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          </Group>
        </UnstyledButton>
      ) : (
        <UnstyledButton
          component={Link}
          to={link || ""}
          className={`${classes.control} ${
            isActive ? classes.controlActive : ""
          }`}
        >
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon
                variant="light"
                size={30}
                className={isActive ? classes.themeIconActive : ""}
              >
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          </Group>
        </UnstyledButton>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
