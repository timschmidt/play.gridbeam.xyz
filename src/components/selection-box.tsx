import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from 'theme-ui'

import {
  doDisableCameraControl,
  doEnableCameraControl,
  doEndSelection,
  doSetSelectionEndPoint,
  doSetSelectionStartPoint,
  doStartSelection,
  getIsSelecting,
  getIsSelectionEnabled,
  getSelectionEndPoint,
  getSelectionStartPoint,
  Point,
} from '../store'

export default SelectionBox

interface SelectionBoxProps {}

function SelectionBox(props: SelectionBoxProps) {
  const dispatch = useDispatch()

  const isEnabled = useSelector(getIsSelectionEnabled)
  const isSelecting = useSelector(getIsSelecting)
  const startPoint = useSelector(getSelectionStartPoint)
  const endPoint = useSelector(getSelectionEndPoint)

  const handleStartSelection = React.useCallback(() => {
    dispatch(doStartSelection())
    dispatch(doDisableCameraControl())
  }, [dispatch])

  const handleEndSelection = React.useCallback(() => {
    dispatch(doEndSelection())
    dispatch(doEnableCameraControl())
  }, [dispatch])

  React.useEffect(() => {
    if (!isEnabled) handleEndSelection()
  }, [handleEndSelection, isEnabled])

  React.useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    function handleMouseDown(ev: MouseEvent) {
      if (!isEnabled) return
      if (!ev.shiftKey) return
      handleStartSelection()
      handleStart(ev)
    }

    function handleMouseMove(ev: MouseEvent) {
      if (!isEnabled) return
      if (!isSelecting) return
      handleEnd(ev)
    }

    function handleMouseUp(ev: MouseEvent) {
      if (!isEnabled) return
      if (!isSelecting) return
      handleEndSelection()
      handleEnd(ev)
    }

    function handleKeyUp(ev: KeyboardEvent) {
      if (!isEnabled) return
      if (!isSelecting) return
      if (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight') {
        handleEndSelection()
      }
    }

    function handleStart(ev: MouseEvent) {
      dispatch(
        doSetSelectionStartPoint({
          x: (ev.clientX / window.innerWidth) * 2 - 1,
          y: -(ev.clientY / window.innerHeight) * 2 + 1,
        }),
      )
    }
    function handleEnd(ev: MouseEvent) {
      dispatch(
        doSetSelectionEndPoint({
          x: (ev.clientX / window.innerWidth) * 2 - 1,
          y: -(ev.clientY / window.innerHeight) * 2 + 1,
        }),
      )
    }
  }, [
    dispatch,
    isEnabled,
    isSelecting,
    handleStartSelection,
    handleEndSelection,
  ])

  if (!isSelecting) return null

  return <SelectBox startPoint={startPoint} endPoint={endPoint} />
}

interface SelectBoxProps {
  startPoint: Point
  endPoint: Point
}

function SelectBox(props: SelectBoxProps) {
  const { startPoint, endPoint } = props

  const bottomRightPoint = React.useMemo(
    () => ({
      x: ((Math.max(startPoint.x, endPoint.x) + 1) / 2) * window.innerWidth,
      y: (-(Math.min(startPoint.y, endPoint.y) - 1) / 2) * window.innerHeight,
    }),
    [startPoint, endPoint],
  )

  const topLeftPoint = React.useMemo(
    () => ({
      x: ((Math.min(startPoint.x, endPoint.x) + 1) / 2) * window.innerWidth,
      y: (-(Math.max(startPoint.y, endPoint.y) - 1) / 2) * window.innerHeight,
    }),
    [startPoint, endPoint],
  )

  return (
    <Box
      css={{
        pointerEvents: 'none',
        border: '1px solid #55aaff',
        backgroundColor: 'rgba(75, 160, 255, 0.3)',
        position: 'fixed',
      }}
      style={{
        left: topLeftPoint.x,
        top: topLeftPoint.y,
        width: bottomRightPoint.x - topLeftPoint.x,
        height: bottomRightPoint.y - topLeftPoint.y,
      }}
    />
  )
}
