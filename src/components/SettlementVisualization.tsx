import { formatCurrency } from '@/lib/utils';
import { Settlement } from '@/types/Expense';

interface SettlementVisualizationProps {
  settlements: Settlement[];
}

export function SettlementVisualization({
  settlements,
}: Readonly<SettlementVisualizationProps>) {
  if (settlements.length === 0) {
    return (
      <div className="text-center p-4  rounded-lg">
        <p>All balances are settled! There are no payments to be made.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Settlement Visualization</h3>
      <p className="text-sm text-gray-400 mb-2">
        This diagram shows the flow of money between group members:
      </p>

      <div className="p-4 rounded-lg">
        {settlements.map((settlement, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="flex items-center">
              <div className="w-1/3 text-right pr-3 font-medium">
                {settlement.fromUserName}
              </div>
              <div className="w-1/3 flex justify-center items-center">
                <div className="h-0.5 w-full bg-pink-100 relative">
                  <div className="absolute top-1/2 bg-pink-100 left-1/2 transform -translate-x-1/2 -translate-y-1/2  px-2 text-black font-bold whitespace-nowrap">
                    {formatCurrency(settlement.amount)}
                  </div>
                  <div className="absolute right-0 top-1/2 transform translate-y-[-50%]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="fill-current text-pink-100"
                    >
                      <polygon points="0,0 12,6 0,12" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-1/3 pl-3 font-medium">
                {settlement.toUserName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
