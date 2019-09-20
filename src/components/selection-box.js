import React from 'react'
import { useStore, useSelector } from 'react-redux'
import { Box } from 'rebass/styled-components'

export default SelectionBox

function SelectionBox (props) {
  const { select, dispatch } = useStore()

  const isEnabled = useSelector(select.selection.isEnabled)
  const isSelecting = useSelector(select.selection.isSelecting)
  const startPoint = useSelector(select.selection.startPoint)
  const endPoint = useSelector(select.selection.endPoint)

  React.useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      dispatch.selection.endSelection()
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    function handleMouseDown (ev) {
      if (!isEnabled) return
      if (!ev.shiftKey) return
      dispatch.selection.startSelection()
      handleStart(ev)
    }

    function handleMouseMove (ev) {
      if (!isEnabled) return
      handleEnd(ev)
    }

    function handleMouseUp (ev) {
      if (!isEnabled) return
      dispatch.selection.endSelection()
      handleEnd(ev)
    }

    function handleKeyUp (ev) {
      if (!isEnabled) return
      if (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight') {
        dispatch.selection.endSelection()
      }
    }

    function handleStart (ev) {
      dispatch.selection.setStartPoint({
        x: (ev.clientX / window.innerWidth) * 2 - 1,
        y: -(ev.clientY / window.innerHeight) * 2 + 1
      })
    }
    function handleEnd (ev) {
      dispatch.selection.setEndPoint({
        x: (ev.clientX / window.innerWidth) * 2 - 1,
        y: -(ev.clientY / window.innerHeight) * 2 + 1
      })
    }
  }, [isEnabled])

  return (
    isSelecting && <SelectBox startPoint={startPoint} endPoint={endPoint} />
  )
}

function SelectBox (props) {
  const { startPoint, endPoint } = props

  const bottomRightPoint = React.useMemo(
    () => ({
      x: ((Math.max(startPoint.x, endPoint.x) + 1) / 2) * window.innerWidth,
      y: (-(Math.min(startPoint.y, endPoint.y) - 1) / 2) * window.innerHeight
    }),
    [startPoint, endPoint]
  )

  const topLeftPoint = React.useMemo(
    () => ({
      x: ((Math.min(startPoint.x, endPoint.x) + 1) / 2) * window.innerWidth,
      y: (-(Math.max(startPoint.y, endPoint.y) - 1) / 2) * window.innerHeight
    }),
    [startPoint, endPoint]
  )

  return (
    <Box
      css={{
        pointerEvents: 'none',
        border: '1px solid #55aaff',
        backgroundColor: 'rgba(75, 160, 255, 0.3)',
        position: 'fixed'
      }}
      style={{
        left: topLeftPoint.x,
        top: topLeftPoint.y,
        width: bottomRightPoint.x - topLeftPoint.x,
        height: bottomRightPoint.y - topLeftPoint.y
      }}
    />
  )
}
