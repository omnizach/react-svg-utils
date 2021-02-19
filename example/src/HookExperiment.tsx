import React, { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { throttle } from 'lodash'
import { useToggleEffect, useConditionalEffect } from 'react-svg-utils'

const MonteCarlo = ({ data, updateCount }: 
                    { 
                      data: number | null, 
                      updateCount: (counts: { countIn: number, countOut: number }) => void 
                    }) => {
  const svg = useRef<SVGSVGElement>(null),
        { current: ctx } = useRef<any>({})

  // init and clear
  useToggleEffect(() => data !== null, () => {
    ctx.points = d3.select(svg.current).select('.points')
    ctx.countIn = 0
    ctx.countOut = 0

    console.log('init')

    return () => {
      console.log('clear')
      ctx.countIn = 0
      ctx.countOut = 0
    }
  }, [data])

  // draw
  useConditionalEffect(() => data !== null, () => {
    console.log('draw', data)

    const pointIsIn = (p: [number, number]) => p[0]**2 + (500-p[1])**2 <= 500*500,
          update = throttle(updateCount, 20)

    ctx.points.selectAll("*").interrupt()
    ctx.countIn = 0
    ctx.countOut = 0

    ctx.points.selectAll('.point').remove()
    ctx.points
        .selectAll('.point')
        .data(d3.range(data || 0).map(() => [Math.random()*500,Math.random()*500]))
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
              ctx.countIn++
            } else {
              ctx.countOut++
            }
            update({
                    countIn: ctx.countIn, 
                    countOut: ctx.countOut
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