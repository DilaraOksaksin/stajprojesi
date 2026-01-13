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

      <Card>
        <CardHeader>
          <CardTitle>Hesap Güvenliği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 2FA SATIRI */}
          <div 
            style={{ cursor: 'pointer' }}
            className="flex items-start justify-between gap-4 select-none hover:bg-slate-50/50 p-2 rounded-lg transition-colors group"
          >
            <div className="pointer-events-none">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">İki Faktörlü Doğrulama (2FA)</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hesabınızın güvenliğini artırmak için ek doğrulama adımı ekler.
              </p>
            </div>
            <Switch style={{ cursor: 'pointer' }} />
          </div>

          {/* GİRİŞ BİLDİRİMLERİ SATIRI */}
          <div 
            style={{ cursor: 'pointer' }}
            className="flex items-start justify-between gap-4 select-none hover:bg-slate-50/50 p-2 rounded-lg transition-colors group"
          >
            <div className="pointer-events-none">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">Giriş Bildirimleri</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Yeni bir cihazdan giriş yapıldığında bildirim alın.
              </p>
            </div>
            <Switch style={{ cursor: 'pointer' }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veri Gizliliği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PROFİL GİZLEME SATIRI */}
          <div 
            style={{ cursor: 'pointer' }}
            className="flex items-start justify-between gap-4 select-none hover:bg-slate-50/50 p-2 rounded-lg transition-colors group"
          >
            <div className="pointer-events-none">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                Profilimi Diğer Kullanıcılara Gizle
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Profil bilgileriniz sadece sizin tarafınızdan görüntülenir.
              </p>
            </div>
            <Switch style={{ cursor: 'pointer' }} />
          </div>

          {/* AKTİVİTE GÜNLÜĞÜ SATIRI */}
          <div 
            style={{ cursor: 'pointer' }}
            className="flex items-start justify-between gap-4 select-none hover:bg-slate-50/50 p-2 rounded-lg transition-colors group"
          >
            <div className="pointer-events-none">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">Aktivite Günlüklerini Tut</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Oturum ve hareket kayıtları daha uzun süre saklanır.
              </p>
            </div>
            <Switch style={{ cursor: 'pointer' }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Oturum Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ÇIKIŞ YAZISI */}
          <p 
            style={{ cursor: 'pointer' }}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors select-none"
          >
            Tüm cihazlardan çıkış yaparak aktif oturumları sonlandırın.
          </p>
          <Button variant="destructive" style={{ cursor: 'pointer' }}>
            Tüm Cihazlardan Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}