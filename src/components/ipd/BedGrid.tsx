import React from 'react';
import { Bed, BedStatus } from '../../types/ipd';
import { User, AlertCircle, CheckCircle } from 'lucide-react';

interface BedGridProps {
    beds: Bed[];
    onSelectBed: (bed: Bed) => void;
}

export const BedGrid: React.FC<BedGridProps> = ({ beds, onSelectBed }) => {
    const getStatusColor = (status: BedStatus) => {
        switch (status) {
            case BedStatus.AVAILABLE: return 'bg-green-100 border-green-300 text-green-800';
            case BedStatus.OCCUPIED: return 'bg-red-100 border-red-300 text-red-800';
            case BedStatus.MAINTENANCE: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case BedStatus.CLEANING: return 'bg-blue-100 border-blue-300 text-blue-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {beds.map(bed => (
                <div
                    key={bed.id}
                    onClick={() => onSelectBed(bed)}
                    className={`
            p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
            flex flex-col items-center justify-center h-32
            ${getStatusColor(bed.status)}
          `}
                >
                    <div className="mb-2">
                        {bed.status === BedStatus.OCCUPIED ? <User size={24} /> :
                            bed.status === BedStatus.MAINTENANCE ? <AlertCircle size={24} /> :
                                <CheckCircle size={24} />}
                    </div>
                    <span className="font-bold text-lg">{bed.bedNumber}</span>
                    <span className="text-xs uppercase mt-1 opacity-75">{bed.status}</span>

                    {bed.admission && (
                        <span className="text-xs font-semibold mt-1 truncate max-w-full px-2">
                            {bed.admission.patient.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};
