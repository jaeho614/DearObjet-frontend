import { SettingsLogoSection } from '../components/settings-logo-section';
import { SettingsCarouselSection } from '../components/settings-carousel-section';
import { SettingsFooterSection } from '../components/settings-footer-section';
import { SettingsTermsSection } from '../components/settings-terms-section';
import { SettingsBusinessSection } from '../components/settings-business-section';

export const AdminMainSettings = () => {
  return (
    <div className="flex flex-col gap-5">
      <SettingsLogoSection />
      <SettingsCarouselSection />
      <SettingsFooterSection />
      <SettingsTermsSection />
      <SettingsBusinessSection />
    </div>
  );
};
