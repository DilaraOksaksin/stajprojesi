"use client";

import { ShieldCheck } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";

export default function PrivacySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50/50 px-4 py-3 text-sm text-green-900">
        <ShieldCheck className="size-5 text-green-600" />
        <span className="font-medium">Hesap Güvenlik Durumu: Yüksek</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Gizlilik ve Güvenlik</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hesap ve veri ayarlarınızı yönetin.
        </p>
      </div>

      {/* HESAP GÜVENLİĞİ KARTI */}
      <Card>
        <CardHeader>
          <CardTitle>Hesap Güvenliği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            { title: "İki Faktörlü Doğrulama (2FA)", desc: "Hesabınızın güvenliğini artırmak için ek doğrulama adımı ekler." },
            { title: "Giriş Bildirimleri", desc: "Yeni bir cihazdan giriş yapıldığında bildirim alın." }
          ].map((item, index) => (
            <div 
              key={index}
              style={{ cursor: 'pointer' }}
              className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-0 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="pointer-events-none select-none">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch style={{ cursor: 'pointer' }} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* VERİ GİZLİLİĞİ KARTI */}
      <Card>
        <CardHeader>
          <CardTitle>Veri Gizliliği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            { title: "Profilimi Diğer Kullanıcılara Gizle", desc: "Profil bilgileriniz sadece sizin tarafınızdan görüntülenir." },
            { title: "Aktivite Günlüklerini Tut", desc: "Oturum ve hareket kayıtları daha uzun süre saklanır." }
          ].map((item, index) => (
            <div 
              key={index}
              style={{ cursor: 'pointer' }}
              className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-0"
            >
              <div className="pointer-events-none select-none">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch style={{ cursor: 'pointer' }} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OTURUM YÖNETİMİ */}
      <Card>
        <CardHeader>
          <CardTitle>Oturum Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground select-none pointer-events-none">
            Tüm cihazlardan çıkış yaparak aktif oturumları sonlandırın.
          </p>
          <Button 
            variant="destructive" 
            style={{ cursor: 'pointer' }}
            className="w-full sm:w-auto"
          >
            Tüm Cihazlardan Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}