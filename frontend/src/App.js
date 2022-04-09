import './App.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function App() {

  const [insertionData, setInsertionData] = useState({});
  const [quickData, setQuickData] = useState({});
  const [mergeData, setMergeData] = useState({});

  useEffect(() => {
    fetch("./audit.json")
    .then(res => res.json())
    .then(data => {
      setInsertionData(data.performance[0]);
      setQuickData(data.performance[1]);
      setMergeData(data.performance[2]);
    });
  }, []);

  return (
    <div className="App">
      <div style={{
        width: "500px",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"
      }}>
        <section style={{marginBottom: "3rem"}}>
          <h1>Runtime</h1>
          <Line 
          data={{
            labels: insertionData.inputSet,
            datasets: [
              {
                label: "insertion sort",
                data: insertionData.runtimeSet,
                fill: true,
                backgroundColor: "red",
                borderColor: "red"
              },
              {
                label: "quick sort",
                data: quickData.runtimeSet,
                fill: true,
                backgroundColor: "green",
                borderColor: "green"
              },
              {
                label: "merge sort",
                data: mergeData.runtimeSet,
                fill: true,
                backgroundColor: "blue",
                borderColor: "blue"
              }
            ]
          }}
          />
        </section>
        <section>
          <h1>Comparisons and Exchanges</h1>
          <Bar
            data={{
              labels: ["insertion", "quick", "merge"],
              datasets: [
                {
                  label: "comparisons",
                  data: [insertionData.comparisons, quickData.comparisons, mergeData.comparisons],
                  fill: true,
                  backgroundColor: "purple",
                  borderColor: "purple"
                },
                {
                  label: "exchanges",
                  data: [insertionData.exchanges, quickData.exchanges, mergeData.exchanges],
                  fill: true,
                  backgroundColor: "limegreen",
                  borderColor: "limegreen"
                },
              ]
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
