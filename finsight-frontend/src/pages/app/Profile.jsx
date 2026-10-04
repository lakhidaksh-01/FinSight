import { useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/layout/PageHeader";
import PreferencesForm from "../../components/profile/PreferencesForm";
import ProfileForm from "../../components/profile/ProfileForm";
import { useProfile } from "../../hooks/useProfile";
import { ROUTES } from "../../constants/app";

export default function Profile() {
	const { profile, saving, error, save, refresh } = useProfile();
	const [notice, setNotice] = useState("");

	const saveProfile = async (values) => {
		setNotice("");
		try {
			await save({ name: values.name });
			toast.success("Profile updated");
		} catch (saveError) {
			setNotice(saveError.message || "Could not save your profile.");
		}
	};

	const savePreferences = async ({ currency, theme }) => {
		setNotice("");
		try {
			await save({ currency, preferences: { ...(profile?.preferences || {}), theme } });
			toast.success("Preferences saved");
		} catch (saveError) {
			setNotice(saveError.message || "Could not save your preferences.");
		}
	};

	return <div className="space-y-6">
		<PageHeader title="Profile & settings" eyebrow="Account" description="Update your account details and choose how FinSight displays your money." />
		{error && <ErrorState message={error} onRetry={refresh} />}
		{notice && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-300">{notice}</p>}
		<div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
			<div className="space-y-4"><ProfileForm profile={profile || {}} loading={saving} onSubmit={saveProfile} /><PreferencesForm preferences={{ ...(profile?.preferences || {}), currency: profile?.currency || profile?.preferences?.currency }} loading={saving} onSubmit={savePreferences} /></div>
			<aside className="h-fit rounded-xl border border-white/[0.08] bg-[#121a16] p-5">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9bd3a9]/10 text-[#a5d9ad]"><UserRound size={18} /></div>
				<h2 className="mt-4 text-sm font-semibold text-white">Account security</h2>
				<p className="mt-2 text-sm leading-6 text-[#91a097]">Password changes use a one-time email code. Your account session is cleared locally when you sign out.</p>
				<Link to={ROUTES.FORGOT_PASSWORD} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#b7dbbd] hover:text-white"><LockKeyhole size={15} /> Reset password</Link>
				<div className="mt-6 border-t border-white/[0.07] pt-4"><p className="text-xs text-[#829087]">Signed in as</p><p className="mt-1 break-all text-sm text-[#c5cec8]">{profile?.email || ""}</p></div>
			</aside>
		</div>
	</div>;
}
