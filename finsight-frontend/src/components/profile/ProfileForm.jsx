import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

function ProfileForm({
  profile = {},
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit?.({
      name: formData.name.trim(),
      email: formData.email.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900">
          Personal Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Keep your FinSight profile information up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          error={errors.name}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled
          helperText="Your sign-in email cannot be changed here."
          required
          error={errors.email}
        />
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;
