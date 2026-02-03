import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

const Settings = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    phone: user?.phone || "",
  });

  const [security, setSecurity] = useState({
    password: "",
    confirmPassword: "",
    twoFA: false,
  });

  const [ui, setUI] = useState({
    theme: "light",
    primaryColor: "#3b82f6", // Tailwind blue
  });

  const handleProfileSave = () => {
    console.log("Profile saved", profile);
    alert("Profile updated!");
  };

  const handleSecuritySave = () => {
    if (security.password !== security.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Security updated", security);
    alert("Security settings updated!");
  };

  const handleUISave = () => {
    console.log("UI settings saved", ui);
    alert("UI settings updated!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      <p className="text-gray-600">Customize your profile, security, and interface.</p>

      {/* Profile Settings */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Profile</h3>
        <div className="space-y-3">
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Input
            label="Company"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
          />
          <Input
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
          <Button onClick={handleProfileSave}>Save Profile</Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <div className="space-y-3">
          <Input
            label="New Password"
            type="password"
            value={security.password}
            onChange={(e) => setSecurity({ ...security, password: e.target.value })}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={security.twoFA}
              onChange={(e) => setSecurity({ ...security, twoFA: e.target.checked })}
              id="twoFA"
            />
            <label htmlFor="twoFA" className="text-sm">Enable Two-Factor Authentication</label>
          </div>
          <Button onClick={handleSecuritySave}>Save Security</Button>
        </div>
      </Card>

      {/* UI / Theme Settings */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Interface & Theme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm w-32">Theme</label>
            <select
              value={ui.theme}
              onChange={(e) => setUI({ ...ui, theme: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm w-32">Primary Color</label>
            <input
              type="color"
              value={ui.primaryColor}
              onChange={(e) => setUI({ ...ui, primaryColor: e.target.value })}
            />
            <span className="text-sm">{ui.primaryColor}</span>
          </div>

          <Button onClick={handleUISave}>Save Interface</Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
