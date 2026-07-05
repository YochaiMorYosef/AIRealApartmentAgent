import ChatPanel from "./components/ChatPanel";
import Dashboard from "./components/Dashboard";
import { useChat } from "./hooks/useChat";
import { useApartments } from "./hooks/useApartments";

function App() {
  const { setApartments,
    loading,
    error,
    cityFilter,
    setCityFilter,
    maxPrice,
    setMaxPrice,
    cities,
    filteredApartments
  } = useApartments();

  const { messages, input, setInput, sending, sendMessage } = useChat({
    onApartmentsUpdate: setApartments
  });

  return (
    <div className="app">
      <ChatPanel
        messages={messages}
        input={input}
        sending={sending}
        onInputChange={setInput}
        onSend={sendMessage}
      />

      <Dashboard
        cities={cities}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        loading={loading}
        error={error}
        filteredApartments={filteredApartments}
      />
    </div>
  );
}

export default App;
