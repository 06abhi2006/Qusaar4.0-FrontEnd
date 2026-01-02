import { useState, useEffect } from 'react';
import { Map, User, Building, Stethoscope } from 'lucide-react';
import apiClient from '../lib/api';
import { HospitalMapFloor } from '../types';

export function HospitalMap() {
    const [floors, setFloors] = useState<HospitalMapFloor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMap() {
            try {
                const { data } = await apiClient.get('/hospital/map');
                setFloors(data);
            } catch (err) {
                console.error("Failed to load map", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMap();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Hospital Map...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
                <Map className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Hospital Map & Directory</h1>
            </div>

            <div className="grid gap-8">
                {floors.map((floor) => (
                    <div key={floor.floorNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Building className="w-5 h-5 mr-2 text-gray-500" />
                                Floor {floor.floorNumber}
                            </h2>
                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            {floor.departments.map((dept) => (
                                <div key={dept.id} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-blue-900 text-lg">{dept.name}</h3>
                                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block mt-1">
                                                {dept.wing}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">{dept.description}</p>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctors on Duty</h4>
                                        {dept.doctors.length > 0 ? (
                                            dept.doctors.map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between text-sm bg-white p-2 rounded -shadow-sm border border-gray-100">
                                                    <div className="flex items-center">
                                                        <Stethoscope className="w-4 h-4 text-green-600 mr-2" />
                                                        <span className="font-medium text-gray-800">{doc.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500">Cabin {doc.cabin}</div>
                                                        {doc.available ? (
                                                            <span className="text-[10px] text-green-600 font-bold">AVAILABLE</span>
                                                        ) : (
                                                            <span className="text-[10px] text-red-500 font-bold">BUSY</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No doctors assigned currently.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
