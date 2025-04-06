'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Users,
  Package,
  Shirt,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  const quickActions = [
    {
      title: t('common.navigation.products'),
      icon: <ShoppingBag className="h-6 w-6" />,
      href: '/products',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: t('common.navigation.orders'),
      icon: <Package className="h-6 w-6" />,
      href: '/orders',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: t('common.navigation.customers'),
      icon: <Users className="h-6 w-6" />,
      href: '/customers',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: t('common.navigation.maintenance'),
      icon: <Shirt className="h-6 w-6" />,
      href: '/maintenance',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: t('common.navigation.packages'),
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/packages',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: t('common.navigation.reports'),
      icon: <Calendar className="h-6 w-6" />,
      href: '/reports',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t('common.appName')} {t('common.navigation.home')}
        </h1>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card
            key={action.href}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(action.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">
                {action.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${action.color}`}>
                {action.icon}
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-start pl-0 text-muted-foreground hover:text-primary"
              >
                {t('common.actions.add')} {action.title} →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We'll add recent activity content here later */}
          <p className="text-muted-foreground">
            Recent orders and maintenance activities will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}