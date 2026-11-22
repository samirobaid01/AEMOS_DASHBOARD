import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Activity, Thermometer, Zap } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: string | React.ReactNode;
  /** @deprecated kept for API compatibility; a consistent brand mark is shown instead of an emoji. */
  icon?: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  const { t } = useTranslation();

  const highlights = [
    { icon: Activity, label: t('auth.highlightRealtime', { defaultValue: 'Real-time telemetry at a glance' }) },
    { icon: Thermometer, label: t('auth.highlightSensors', { defaultValue: 'Monitor sensors across every field' }) },
    { icon: Zap, label: t('auth.highlightRules', { defaultValue: 'Automate with the rule engine' }) },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background dark:bg-background-dark">
      {/* Brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-leaf-700 via-leaf-600 to-leaf-800 text-white">
        {/* subtle decorative glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-leaf-900/30 blur-3xl" aria-hidden />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
              <Leaf className="w-6 h-6" aria-hidden />
            </div>
            <span className="text-xl font-bold tracking-tight">
              AEMOS <span className="text-leaf-200 font-semibold">Agriculture</span>
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
              {t('auth.brandHeadline', { defaultValue: 'The control room for your farm.' })}
            </h2>
            <p className="text-leaf-100/90 text-lg mb-10">
              {t('auth.brandSubhead', {
                defaultValue: 'One place to watch every sensor, device, and automation — live.',
              })}
            </p>
            <ul className="space-y-4">
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/15 grid place-items-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="text-leaf-50">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-leaf-200/70 text-sm">
            © {new Date().getFullYear()} AEMOS
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-leaf-600 text-white grid place-items-center shrink-0">
              <Leaf className="w-5 h-5" aria-hidden />
            </div>
            <span className="text-lg font-bold text-textPrimary dark:text-textPrimary-dark">
              AEMOS <span className="text-leaf-600 dark:text-leaf-400 font-semibold">Agri</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-textPrimary dark:text-textPrimary-dark">
              {title}
            </h1>
            {subtitle && (
              <div className="mt-2 text-sm text-textSecondary dark:text-textMuted-dark">
                {subtitle}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
