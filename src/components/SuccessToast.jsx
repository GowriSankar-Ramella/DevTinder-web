import { CheckCircle, X, } from "lucide-react";

const SuccessToast = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Success</p>
                        <p className="text-sm text-green-700 mt-1">{message}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="ml-3 text-green-400 hover:text-green-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuccessToast