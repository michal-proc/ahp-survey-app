import React from "react";

interface RankingTableProps {
    title: string;
    data: { id: string; name: string; score: number }[];
    getPlaceColor: (index: number) => string;
}

const RankingTable: React.FC<RankingTableProps> = ({ title, data, getPlaceColor }) => {
    const places = data.reduce((acc, alt, index) => {
        const lastPlace = acc[index - 1]?.place || 1;
        const lastScore = acc[index - 1]?.score || 0;

        acc.push({
            ...alt,
            place: alt.score === lastScore ? lastPlace : index + 1,
        });

        return acc;
    }, [] as { id: string; name: string; score: number; place: number }[]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>
            <div className="overflow-auto rounded-lg">
                <table className="min-w-full table-auto border-collapse rounded-lg">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 bg-gradient-to-r from-[#F53132] to-[#943D3D] text-white text-center rounded-tl-lg">
                                Miejsce
                            </th>
                            <th className="border border-gray-300 px-4 py-3 bg-gradient-to-r from-[#F53132] to-[#943D3D] text-white text-left">
                                Nazwa Alternatywy
                            </th>
                            <th className="border border-gray-300 px-4 py-3 bg-gradient-to-r from-[#F53132] to-[#943D3D] text-white text-right rounded-tr-lg">
                                Wynik (%)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {places.map((alt) => (
                            <tr
                                key={alt.id}
                                className="group hover:bg-[#FEE2E2] transition duration-200"
                            >
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <div
                                        className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg mx-auto`}
                                        style={{
                                            backgroundColor: getPlaceColor(alt.place),
                                            color: "white",
                                            boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
                                        }}
                                    >
                                        {alt.place}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-gray-800">
                                    {alt.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                                    {alt.score.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingTable;
