import type { ReactNode } from "react";

export type DataTableColumn<T> = {
	key: string;
	header: string;
	headerAlign?: string;
	className?: string;
	render: (item: T) => ReactNode;
};

type DataTableProps<T> = {
	data: T[];
	columns: DataTableColumn<T>[];
	getRowKey: (item: T) => string;
	emptyTitle?: string;
	emptyDescription?: string;
	renderMobileItem?: (item: T) => ReactNode;
};

export function DataTable<T>({data, columns, getRowKey, emptyTitle = "Nenhum registro encontrado", emptyDescription = "Não existem informações para exibir no momento.", renderMobileItem}: DataTableProps<T>) {
	if (data.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-12 text-center sm:px-6 sm:py-14">
				<h3 className="font-medium text-zinc-900">
					{emptyTitle}
				</h3>
				<p className="mt-2 text-sm leading-6 text-zinc-500">
					{emptyDescription}
				</p>
			</div>
		);
	}

	return (
		<>
			{renderMobileItem && (
				<div className="grid gap-4 md:hidden">
					{data.map((item) => (
						<div key={getRowKey(item)}>
							{renderMobileItem(item)}
						</div>
					))}
				</div>
			)}

			<div className={renderMobileItem ? "hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block" : "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"}>
				<div className="overflow-x-auto">
					<table className="w-full min-w-180 border-collapse">
						<thead className="bg-zinc-50">
							<tr>
								{columns.map((column) => (
									<th key={column.key} className={`border-b border-zinc-200 px-5 py-4 text-${column.headerAlign ? column.headerAlign : "left"} text-xs font-semibold uppercase tracking-wide text-zinc-500 ${column.className ?? ""}`}>
										{column.header}
									</th>
								))}
							</tr>
						</thead>

						<tbody className="divide-y divide-zinc-100">
							{data.map((item) => (
								<tr key={getRowKey(item)} className="transition hover:bg-zinc-50">
									{columns.map((column) => (
										<td key={column.key} className={`px-5 py-4 text-sm text-zinc-700 ${column.className ?? ""}`}>
											{column.render(item)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}