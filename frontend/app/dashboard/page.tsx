"use client";

import {useEffect, useState} from "react";
import { getAnalytics } from "../../services/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
}
from "recharts";

export default function Dashboard(){

const[ data, setData ]= useState( null );

useEffect(() => {

  async function load() {

    try {

      const res = await getAnalytics();

      console.log(res);

      setData(res);

    } catch (error) {

      console.error(
        "Error fetching analytics data:",
        error
      );
    }
  }

  load();

  const interval = setInterval(
    load,
    5000
  );

  return () => clearInterval( interval );

}, []);

if( !data ){

return( 
<div> Loading... </div>
);

}

return (

<div className="min-h-screen bg-black text-white p-8">
<div className="text-green-400 text-sm mb-3">● Live</div>

  <h1 className="text-4xl mb-8">
    Observability Dashboard
  </h1>

  <div className="grid grid-cols-4 gap-6">

    <Card
      title="Requests"
      value={data.total}
    />

    <Card
      title="Latency"
      value={`${data.avgLatency} ms`}
    />

    <Card
      title="Errors"
      value={data.errorRate}
    />

    <Card
      title="Throughput"
      value={data.throughput}
    />

  </div>

  {/* Chart */}

  <div
    className="
      mt-10
      bg-gradient-to-br
      from-[#181818]
      to-[#101010]

      rounded-3xl

      border
      border-neutral-800

      p-10

      shadow-xl
      "
  >

    <h2 className="text-2xl mb-8">
      Latency Trend
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart
        data={data.latencyTrend}
      >

        <XAxis
          dataKey="timestamp"
        />

        <YAxis />

        <Tooltip
        contentStyle={{
            background: "#181818",
            border: "1px solid #333",
            borderRadius: "16px",
            color: "#fff"
        }}

        labelStyle={{
            color: "#aaa"
        }}

        itemStyle={{
            color: "#fff"
        }}
        />

        <Line
          type="monotone"
          dataKey="latency"
          stroke="#ffffff"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

  <div className="mt-10 bg-[#181818] rounded-3xl border border-neutral-800 overflow-hidden">

<div className="px-8 py-6 text-2xl"> Recent Inferences </div>

<table className="w-full">

<thead>

<tr className="text-neutral-500 border-b border-neutral-800">

<th className="p-5 text-left">
Time
</th>

<th className="p-5 text-left">
Model
</th>

<th className="p-5 text-left">
Status
</th>

<th className="p-5 text-left">
Latency
</th>

</tr>

</thead>

<tbody>

{
data.recentLogs.map(
(
log,
index
)=>(

<tr
key={index}

className="
border-b
border-neutral-900
"
>

<td className="p-5">
{log.timestamp}
</td>

<td className="p-5">
{log.model}
</td>

<td
className={`p-5

${
log.status
===

"success"

?

"text-green-400"

:

"text-red-400"

}
`}
>

{log.status}

</td>

<td className="p-5">

{
log.latency

?

`${log.latency} ms`

:

"-"

}

</td>

</tr>

)

)
}

</tbody>

</table>

</div>

<div
className="
mt-10
bg-[#181818]
rounded-3xl
border
border-neutral-800
p-8
"
>

<h2
className="
text-2xl
mb-8
"
>

Provider Usage

</h2>

<ResponsiveContainer
  width="100%"
  height={220}
>

  <BarChart
    data={ data.providerUsage }
    layout="vertical"
    barCategoryGap="35%"

    margin={{
      left: 30,
      right: 40,
    }}
  >

    <XAxis
      type="number"

      tick={{
        fill:
          "#888"
      }}
    />

    <YAxis
      type="category"

      dataKey="provider"

      tick={{
        fill:
          "#fff"
      }}
    />

    <Tooltip
    cursor={false}

    contentStyle={{
      background: "#181818",

      border:
        "1px solid #333",

      borderRadius:
        "16px",

      color:
        "#fff",
      }}
  />

    <Bar
      dataKey="count"

      radius={[
        0,
        14,
        14,
        0
      ]}

      fill="#7c3aed"
      activeBar={false}
    />

  </BarChart>

</ResponsiveContainer>

</div>

</div>

);

}

function Card({ title, value }) {

  return (

    <div
      className="
      bg-[#181818]
      border
      border-neutral-800
      rounded-3xl
      p-8
      shadow-lg
      hover:scale-[1.02]
      transition
      duration-300
      "
    >

      <div
        className="
        text-neutral-400
        text-sm
        uppercase
        tracking-wide
        "
      >
        {title}
      </div>

      <div
        className="
        text-5xl
        font-bold
        mt-4
        "
      >
        {value}
      </div>

    </div>

  );

}