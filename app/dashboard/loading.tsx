export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* HEADER SECTION SKELETON */}
            <div className="bg-[#0f1423] p-8 lg:p-10 rounded-4xl border border-white/5 h-48 w-full shadow-2xl">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-white/10 rounded w-1/2"></div>
            </div>

            {/* CARDS SKELETON */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-40 rounded-3xl bg-[#0f1423] border border-white/5 p-6 flex flex-col justify-between">
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                        <div className="h-10 bg-white/10 rounded w-1/3"></div>
                    </div>
                ))}
            </div>

            {/* CHARTS SKELETON */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-5 h-[500px] bg-[#0f1423] rounded-[2.5rem] border border-white/5 p-8 inline-flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-white/5"></div>
                </div>
                <div className="xl:col-span-7 h-[500px] bg-[#0f1423] rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
                    <div className="flex justify-between w-full mb-8">
                        <div className="h-8 bg-white/10 rounded w-1/4"></div>
                        <div className="h-8 bg-white/10 rounded w-1/5"></div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-[#161b2a] rounded-3xl border border-white/5"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
