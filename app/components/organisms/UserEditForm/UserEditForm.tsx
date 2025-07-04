"use client";

import type { User } from "@/app/types/User";
import { useState } from "react";
import { TabList } from "../../molecules/TabList";
import { UserSNSForm } from "../UserSNSForm";
import { UserProfileForm } from "../UserProfileForm";

export const UserEditForm = ({ user, onCloseModal }: { user: User; onCloseModal: () => void }) => {
  const tabItems = [
    { label: "基本情報", value: "basic" },
    { label: "SNS", value: "sns" },
  ] as const;
  type TabValue = (typeof tabItems)[number]["value"];
  const [activeTab, setActiveTab] = useState<TabValue>("basic");

  return (
    <div>
      <TabList tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {/* 基本情報フォーム */}
        {activeTab === "basic" && <UserProfileForm user={user} onCloseModal={onCloseModal} />}

        {/* SNSフォーム */}
        {activeTab === "sns" && <UserSNSForm user={user} onCloseModal={onCloseModal} />}
      </div>
    </div>
  );
};
