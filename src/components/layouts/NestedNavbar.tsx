import { Group, ScrollArea, Text } from "@mantine/core";
import {
  IconBook,
  IconBuildingSkyscraper,
  IconDashboard,
  IconHeadphones,
  IconUser,
  IconUserCheck,
  IconUserPlus,
} from "@tabler/icons-react";
import { LinksGroup } from "../navbar-linkgroup/NavbarLinksGroup";
import { UserButton } from "./LogoutButton";
import classes from "./NavbarNested.module.css";

const navItems = [
  { label: "Trang chủ", icon: IconDashboard, link: "/dashboard" },
  { label: "Tài khoản", icon: IconUser, link: "/users" },
  { label: "Giáo viên", icon: IconUserCheck, link: "/teachers" },
  { label: "Học viên", icon: IconUserPlus, link: "/students" },
  { label: "Phòng học", icon: IconBuildingSkyscraper, link: "/rooms" },
  { label: "Khoá học", icon: IconBook, link: "/courses" },
  {
    label: "Luyện tập",
    icon: IconHeadphones,
    initiallyOpened: true,
    links: [{ label: "Luyện nghe", link: "/practice/listening" }],
  },
];

export function NavbarNested() {
  const links = navItems.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar} style={{ width: "100%", height: "100%" }}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Text fw={700}>EngStudy</Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
