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

			<div className="grid grid-cols-2 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm sm:inline-flex">
				<button type="button" onClick={() => setActiveTab("contributions")} className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition sm:px-4 sm:py-2 ${activeTab === "contributions" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"}`}>
					Presentes
					<span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
						{contributions.length}
					</span>
				</button>

				<button type="button" onClick={() => setActiveTab("letters")} className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition sm:px-4 sm:py-2 ${activeTab === "letters" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"}`}>
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