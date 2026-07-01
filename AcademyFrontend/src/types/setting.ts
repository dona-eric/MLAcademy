import { User, Shield, Bell, CreditCard } from "lucide-react";
import React from "react";

export type SettingsTab = "account" | "security" | "notifications" | "billing";

export interface Setting {
    id: SettingsTab;
    label: string;
    icon: React.ComponentType<any>;
}

export const SETTING_TABS: Setting[] = [
    { id: "account", label: "Identité", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Alertes", icon: Bell },
    { id: "billing", label: "Facturation", icon: CreditCard },
];