"use client";

import { useState } from "react";
import { PendingContributionsTable } from "./pending-contributions-table";
import { PendingLettersTable } from "./pending-letters-table";

type Contribution = Parameters<typeof PendingContributionsTable>[0]["contributions"][number];

type Letter = Parameters<typeof PendingLettersTable>[0]["letters"][number];

type PendingApprovalsProps = {
	contributions: Contribution[];
	letters: Letter[];
};

type ActiveTab = "contributions" | "letters";

export function PendingApprovals({ contributions, letters }: PendingApprovalsProps) {
	const [activeTab, setActiveTab] =  useState<ActiveTab>("contributions");

	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-xl font-semibold text-zinc-950">
					Aprovações pendentes
				</h2>

				<p className="mt-1 text-sm text-zinc-500">
					Analise contribuições e cartinhas antes da publicação.
				</p>
			</div>

			<div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
				<button type="button" onClick={() => setActiveTab("contributions")} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === "contributions" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"}`}>
					Presentes
					<span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
						{contributions.length}
					</span>
				</button>

				<button type="button" onClick={() => setActiveTab("letters")} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === "letters" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"}`}>
					Cartinhas
					<span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
						{letters.length}
					</span>
				</button>
			</div>

			{activeTab === "contributions" ? (
				<PendingContributionsTable contributions={contributions} />
			) : (
				<PendingLettersTable letters={letters} />
			)}
		</section>
	);
}