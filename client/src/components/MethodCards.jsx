const MethodCards = ({ icon: Icon, method, options, onClick }) => {
    return (
        <div
            className="flex w-full sm:min-w-[200px] min-w-[41.66%] max-w-sm h-40 justify-center items-center"
            onClick={onClick}
        >
            <div className="bg-white p-4 border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer text-center w-full">
                <Icon className="w-8 h-8 mb-3 mx-auto text-gray-900" />
                <h3 className="text-lg font-semibold text-gray-800">{method}</h3>
                <p className="text-sm text-gray-500">{options}</p>
            </div>
        </div>
    );
};

export default MethodCards;
