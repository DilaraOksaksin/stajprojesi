import Image from "next/image";
import { Button } from "../component/ui/button";
import { Checkbox } from "../component/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../component/ui/card";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start justify-start py-20 px-10 bg-white dark:bg-black">

        {/* LOGO */}
        <Image
          className="dark:invert mb-10"
          src="/next.svg"
          alt="Logo"
          width={100}
          height={20}
          priority
        />

        {/* KARTLAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">

          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı</CardTitle>
            </CardHeader>
            <CardContent>
              Kullanıcı profili ve bilgiler.
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Görüntüle</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bildirimler</CardTitle>
            </CardHeader>
            <CardContent>
              En son etkinlikler.
            </CardContent>
            <CardFooter>
              <Button>İncele</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ayarlar</CardTitle>
            </CardHeader>
            <CardContent>
              Hesap ve uygulama ayarları.
            </CardContent>
            <CardFooter>
              <Button variant="outline">Düzenle</Button>
            </CardFooter>
          </Card>

        </div>

        {/* CHECKBOX */}
        <div className="flex items-center space-x-3 mt-10">
          <Checkbox id="agree" />
          <label htmlFor="agree" className="text-zinc-700 dark:text-zinc-300">
            Devam etmek için onaylayın
          </label>
        </div>

        {/* BUTTON */}
        <Button className="mt-6">Kaydet</Button>

      </main>
    </div>
  );
}
