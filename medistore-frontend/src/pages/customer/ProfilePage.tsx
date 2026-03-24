import React, { useState } from "react";
import { User, Phone, MapPin, Lock, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";
import { getErrorMessage } from "../../utils";
import MainLayout from "../../components/layout/MainLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ProtectedRoute from "../../routes/ProtectedRoute";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", address: user?.address ?? "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState("");

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile(profileForm);
      updateUser({ ...user!, ...res.data.data });
      toast.success("Profile updated!");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSavingProfile(false); }
  };

  const savePassword = async () => {
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("Passwords don't match"); return; }
    if (pwForm.newPassword.length < 6) { setPwError("Minimum 6 characters"); return; }
    setSavingPw(true);
    try {
      await authApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed!");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSavingPw(false); }
  };

  const setP = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm((p) => ({ ...p, [field]: e.target.value }));
  const setPw = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-8">Profile</h1>

          {/* Avatar */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-500/20 border border-brand-500/30 rounded-full flex items-center justify-center">
              <span className="text-brand-400 text-2xl font-bold font-display">{user?.name[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-200">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <span className="text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-5">
            <h2 className="font-display font-semibold text-gray-200 mb-4">Personal Information</h2>
            <div className="flex flex-col gap-4">
              <Input label="Full name" icon={<User size={14} />} value={profileForm.name} onChange={setP("name")} />
              <Input label="Phone number" icon={<Phone size={14} />} value={profileForm.phone} onChange={setP("phone")} placeholder="+880..." />
              <Input label="Address" icon={<MapPin size={14} />} value={profileForm.address} onChange={setP("address")} placeholder="Your address..." />
              <Button onClick={saveProfile} loading={savingProfile} icon={<Save size={14} />} className="self-start">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <h2 className="font-display font-semibold text-gray-200 mb-4">Change Password</h2>
            <div className="flex flex-col gap-4">
              <Input label="Current password" type="password" icon={<Lock size={14} />} value={pwForm.currentPassword} onChange={setPw("currentPassword")} />
              <Input label="New password" type="password" icon={<Lock size={14} />} value={pwForm.newPassword} onChange={setPw("newPassword")} />
              <Input label="Confirm new password" type="password" icon={<Lock size={14} />} value={pwForm.confirmPassword} onChange={setPw("confirmPassword")} error={pwError} />
              <Button onClick={savePassword} loading={savingPw} variant="secondary" icon={<Lock size={14} />} className="self-start">
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
