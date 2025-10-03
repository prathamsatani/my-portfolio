"use client";

import { motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react";

// Shared UI Components with Animations

export function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-4 mb-8"
    >
      <motion.div 
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 shadow-lg shadow-teal-500/30 flex-shrink-0 p-[2px]"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
          <Icon className="h-6 w-6 text-teal-500" />
        </div>
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </motion.div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helperText,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block text-sm text-slate-700"
    >
      <span className="mb-2 block font-medium text-slate-900">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-50 shadow-sm"
      />
      {helperText && <span className="mt-1.5 block text-xs text-slate-500">{helperText}</span>}
    </motion.label>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block text-sm text-slate-700"
    >
      <span className="mb-2 block font-medium text-slate-900">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 hover:border-slate-300 shadow-sm resize-none"
      />
    </motion.label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block text-sm text-slate-700"
    >
      <span className="mb-2 block font-medium text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 hover:border-slate-300 shadow-sm cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group"
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-5 w-5 rounded-lg border-2 border-slate-300 bg-white text-teal-500 focus:ring-4 focus:ring-teal-400/20 cursor-pointer transition-all shadow-sm hover:border-teal-300"
        />
        <div className="absolute inset-0 rounded-lg bg-teal-50 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <span className="group-hover:text-slate-900 font-medium transition-colors">{label}</span>
    </motion.label>
  );
}

export function Button({
  children,
  icon,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/40 hover:from-slate-800 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  icon,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-teal-300 hover:bg-slate-50 hover:text-slate-900"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function ListCard({
  title,
  subtitle,
  badges,
  onEdit,
  onDelete,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  badges?: string[];
  onEdit: () => void;
  onDelete: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      className="group flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-teal-300 hover:bg-slate-50 hover:shadow-lg"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
        )}
        {badges && badges.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + index * 0.05 }}
                className="inline-flex items-center rounded-full border border-teal-400/40 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 shadow-sm"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <motion.button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            whileHover={{ rotate: 15 }}
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </motion.svg>
          Edit
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-700 shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            whileHover={{ rotate: 15 }}
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </motion.svg>
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Alert({ message, onClose }: { message: string; onClose: () => void }) {
  const isError = message.includes("❌");
  const isSuccess = message.includes("✅");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative mt-6 rounded-xl border-2 px-5 py-4 shadow-lg ${
        isError
          ? "border-red-300 bg-red-50 text-red-700"
          : isSuccess
          ? "border-teal-300 bg-teal-50 text-teal-700"
          : "border-blue-300 bg-blue-50 text-blue-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {isError ? (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <motion.button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  total,
  icon: Icon,
  color = "emerald",
  delay = 0,
}: {
  label: string;
  value: number;
  total?: number;
  icon: LucideIcon;
  color?: "emerald" | "blue" | "purple" | "red";
  delay?: number;
}) {
  const colorClasses = {
    emerald: "from-teal-400 to-emerald-500 shadow-teal-500/30 bg-teal-50 text-teal-600",
    blue: "from-blue-400 to-blue-600 shadow-blue-500/30 bg-blue-50 text-blue-600",
    purple: "from-purple-400 to-purple-600 shadow-purple-500/30 bg-purple-50 text-purple-600",
    red: "from-pink-400 to-red-500 shadow-red-500/30 bg-red-50 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${colorClasses[color].split('shadow')[0]} opacity-5 group-hover:opacity-10 transition-opacity blur-3xl`} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <motion.p
              className="text-4xl font-bold text-slate-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
            {total !== undefined && (
              <p className="text-sm text-slate-500">/ {total}</p>
            )}
          </div>
        </div>
        <motion.div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${colorClasses[color]}`}
          whileHover={{ rotate: 360, scale: 1.15 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>
      
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colorClasses[color].split('shadow')[0]} opacity-0 group-hover:opacity-100 rounded-full`}
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
