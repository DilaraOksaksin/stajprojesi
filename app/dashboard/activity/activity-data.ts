import { Search, Star, User } from "lucide-react";

export type ActivityItem = {
  id: number;
  icon: typeof Search;
  type: "Arama" | "Favori" | "Kayıt";
  dateGroup: "Bugün" | "Dün" | "Son 7 Gün";
  tag: string;
  text: string;
  time: string;
};

export const activities: ActivityItem[] = [
  {
    id: 1,
    icon: Search,
    type: "Arama",
    dateGroup: "Bugün",
    tag: "[ID: 104]",
    text: "Kullanıcı araması yapıldı",
    time: "10:45",
  },
  {
    id: 2,
    icon: Star,
    type: "Favori",
    dateGroup: "Dün",
    tag: "[GET]",
    text: "Leanne Graham favorilere eklendi",
    time: "09:18",
  },
  {
    id: 3,
    icon: User,
    type: "Kayıt",
    dateGroup: "Son 7 Gün",
    tag: "[POST]",
    text: "Yeni kullanıcı kaydı oluşturuldu",
    time: "08:02",
  },
];
