"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "@/app/(main)/redux/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API = process.env.NEXT_PUBLIC_API_URI;

/* ---------------- SECTION ---------------- */
function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs tracking-widest text-zinc-500 uppercase">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ---------------- FIELD ---------------- */
function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500">{label}</label>
      <Input
        {...props}
        className="
          bg-zinc-900/60
          border-zinc-800
          focus:border-blue-500
          focus:ring-1 focus:ring-blue-500
          transition
        "
      />
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export default function EditProfileDialog() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    gender: "prefer not to say",
    profilePicture: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "XXXXXXXXXX",
      department: user.department || "",
      designation: user.designation || "",
      gender: user.gender || "prefer not to say",
      profilePicture: user.profilePicture || "",
    });
  }, [user]);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const updateProfile = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/v1/user/${user._id}`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-zinc-200">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[100vw]
          sm:w-[95vw]
          sm:max-w-3xl
          lg:max-w-5xl
          p-0
          bg-zinc-950
          border border-zinc-800
          text-white
          overflow-hidden
          md:max-h-[100vh]
          sm:max-h-[90vh]
          max-h-[85vh]
          flex flex-col scrollable
        "
      >
        {/* HEADER */}
        <DialogHeader className="p-4 sm:p-6 border-b border-zinc-800">
          <DialogTitle className="text-base sm:text-lg">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* MOBILE HEADER (PROFILE SUMMARY) */}
          <div className="md:hidden p-4 flex items-center gap-3 border-b border-zinc-800">
            <img
              src={form.profilePicture || "/avatar.png"}
              className="w-12 h-12 rounded-full object-cover border border-zinc-700"
            />
            <div>
              <p className="text-sm font-medium">
                {form.name || "Your Name"}
              </p>
              <p className="text-xs text-zinc-500">
                @{form.username || "username"}
              </p>
            </div>
          </div>

          {/* DESKTOP LEFT PANEL */}
          <div className="
            hidden md:flex
            p-6
            w-[320px]
            border-r border-zinc-800
            flex-col items-center gap-4
          ">
            <img
              src={form.profilePicture || "/avatar.png"}
              className="w-24 h-24 rounded-full object-cover border border-zinc-700"
            />

            <div className="text-center">
              <p className="text-sm font-medium">{form.name}</p>
              <p className="text-xs text-zinc-500">
                @{form.username}
              </p>
            </div>

            <Field
              label="Profile Image URL"
              name="profilePicture"
              value={form.profilePicture}
              onChange={onChange}
            />
          </div>

          {/* FORM */}
          <div className="
            flex-1
            p-4 sm:p-6
            space-y-6
            overflow-y-auto
            pb-24
          ">
            <Section title="Identity">
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={onChange}
              />
              <Field
                label="Username"
                name="username"
                value={form.username}
                onChange={onChange}
              />
            </Section>

            <Section title="Contact">
              <Field
                label="Email"
                name="email"
                value={form.email}
                onChange={onChange}
              />
              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
              />
            </Section>

            <Section title="Work">
              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={onChange}
              />
              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={onChange}
              />
            </Section>

            <Section title="Preferences">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  className="
                    bg-zinc-900
                    border border-zinc-800
                    p-3 rounded-md
                    focus:border-blue-500
                    outline-none
                  "
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>
            </Section>
          </div>
        </div>

        {/* MOBILE + DESKTOP FIXED FOOTER */}
        <div className="
          sticky bottom-0
          p-4
          border-t border-zinc-800
          bg-zinc-950
          flex flex-col sm:flex-row gap-3
        ">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-zinc-700 w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}