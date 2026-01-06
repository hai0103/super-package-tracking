import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Truck, AlertCircle, Phone, User, Heart } from 'lucide-react';
import moment from 'moment';

const TrackingResult = ({ data, isWatched, onToggleWatch, watchLoading }) => {
    if (!data) return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Lỗi khi tải thông tin đơn hàng</p>
            </div>
        </div>
    );

    const renderPersonInfo = (info, label) => {
        if (!info) return (
            <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-bold dark:text-gray-500">{label}</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">---</p>
            </div>
        );

        if (typeof info === 'string') {
            return (
                <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold dark:text-gray-500">{label}</p>
                    <p className="font-bold text-gray-700 dark:text-gray-200">{info}</p>
                </div>
            );
        }

        return (
            <div className="text-left bg-gray-50 p-3 rounded-xl dark:bg-gray-700/50 min-w-[200px]">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 dark:text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> {label}
                </p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{info.name}</p>
                {info.phone && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {info.phone}
                    </p>
                )}
                {info.address && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> <span className="line-clamp-2">{info.address}</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-4">
            {/* Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-paw-pink/20 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-paw-pink/20 to-transparent rounded-bl-full -mr-8 -mt-8"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider dark:bg-gray-700 dark:text-gray-300">
                                    {data.carrier}
                                </span>
                                <span className="text-gray-400 text-sm font-mono dark:text-gray-500">#{data.trackingNumber}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
                                {data.status || 'Đang vận chuyển'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                Cập nhật: {data.updatedAt ? moment(data.updatedAt).format('DD/MM/YYYY HH:mm:ss') : new Date().toLocaleString('vi-VN')}
                            </p>
                        </div>

                        {/* Watch Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={onToggleWatch}
                                disabled={watchLoading}
                                className={`p-3 rounded-full transition-all shadow-sm ${isWatched
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400 dark:bg-gray-700 dark:text-gray-500'
                                    }`}
                                title={isWatched ? "Bỏ theo dõi" : "Theo dõi đơn hàng này"}
                            >
                                <Heart className={`w-6 h-6 ${isWatched ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                        {renderPersonInfo(data.sender, 'Người gửi')}
                        {renderPersonInfo(data.receiver, 'Người nhận')}
                    </div>
                </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
            >
                <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2 dark:text-white">
                    <Truck className="w-5 h-5 text-paw-pink" />
                    Hành trình đơn hàng
                </h3>

                <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-8">
                    {data.events && data.events.map((event, index) => {
                        const isLatest = index === 0;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index + 0.3 }}
                                className="relative"
                            >
                                <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${isLatest ? 'bg-paw-pink ring-4 ring-paw-pink/20' : 'bg-gray-300 dark:bg-gray-600'}`}></div>

                                <div className={`bg-gray-50 rounded-2xl p-4 transition-colors duration-300 dark:bg-gray-700/50 ${isLatest ? 'bg-paw-pink/5 border border-paw-pink/10 dark:bg-paw-pink/10 dark:border-paw-pink/20' : ''}`}>
                                    <p className={`font-bold text-sm mb-1 ${isLatest ? 'text-paw-pink-dark dark:text-paw-pink-light' : 'text-gray-700 dark:text-gray-200'}`}>
                                        {event.status}
                                    </p>
                                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        <span>{new Date(event.date || event.time).toLocaleString('vi-VN')}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-start gap-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
                                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default TrackingResult;
