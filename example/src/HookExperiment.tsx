import React, { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { throttle } from 'lodash'

//const MonteCarlo = ({ data: number, updateCount: (countIn: number, countOut: number) => void }) => {
const MonteCarlo = ({ data, updateCount }: 
                    { 
                      data: number | null, 
                      updateCount: (counts: { countIn: number, countOut: number }) => void 
                    }) => {
  const svg = useRef<SVGSVGElement>(null),
        didInit = useRef(false),
        context = useRef<any>({})

  useEffect(() => {
    // init
    if (!didInit.current && data !== null) {
      context.current.points = d3.select(svg.current).select('.points')
      context.current.countIn = 0
      context.current.countOut = 0

      didInit.current = true
    }

    // clear
    if (didInit.current && data === null) {
      context.current = {}
      didInit.current = false
    }
  }, [didInit, data])

  // draw
  useEffect(() => {
    console.log(data)
    if (data === null) {
      return
    }
    const pointIsIn = (p: [number, number]) => p[0]**2 + (500-p[1])**2 <= 500*500,
          update = throttle(updateCount, 20)

    context.current.points.selectAll("*").interrupt()
    context.current.countIn = 0
    context.current.countOut = 0

    context.current.points.selectAll('.point').remove()
    context.current.points
        .selectAll('.point')
        .data(d3.range(data).map(() => [Math.random()*500,Math.random()*500]))
        .enter()
        .append('circle')
          .attr('class', (d:[number, number]) => pointIsIn(d) ? 'point point-in' : 'point point-out')
          .attr('cx', (d:any) => d[0])
          .attr('cy', (d:any) => d[1])
          .attr('r', 1)
          .attr('opacity', 0)
        .transition()
        .delay((_d:any, i:number) => i * 1)
          .attr('opacity', 1)
          .on('end', (d: [number, number], i:number) => {
            if (pointIsIn(d)) {
              context.current.countIn++
            } else {
              context.current.countOut++
            }
            update({
                    countIn: context.current.countIn, 
                    countOut: context.current.countOut
                  })
          })
  }, [data, updateCount])

  if (data === null) {
    return null
  }

  // render
  return (
    <svg width="500" height="500" ref={svg}>
      <circle cx="0" cy="500" r="500" fill="#006" fillOpacity="20%" stroke="none" />
      <rect fill="none" stroke="#000" strokeWidth="5" width="500" height="500" />
      <g className="points" />
    </svg>
  )
}

export const MonteCarloPi = () => {
  const [iterations, setIterations] = useState(100),
        [data, setData] = useState<number | null>(null),
        [counts, setCounts] = useState({ countIn: 0, countOut: 0 })

  return (
    <div>
      <div>
        <input type="range" step="10" min="100" max="10000" 
          defaultValue={iterations} 
          onChange={e => setIterations(+e.target.value)} 
        />
        <div>{iterations} Iterations</div>
        <div>Samples In: {counts.countIn}</div>
        <div>Samples Out: {counts.countOut}</div>
        <div>Total: {counts.countIn+counts.countOut}</div>
        { counts.countIn+counts.countOut > 0 &&
          <div>π ≈ {4 * counts.countIn / (counts.countIn+counts.countOut)}</div>
        }
        <button onClick={() => setData(iterations)}>Go</button>
        <button onClick={() => setData(null)}>Reset</button>
      </div>
      <MonteCarlo 
        data={data} 
        updateCount={setCounts} 
      />
    </div>
  )
}