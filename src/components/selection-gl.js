import React from 'react'
import * as THREE from 'three'
import { useThree } from 'react-three-fiber'
import { Box } from 'rebass/styled-components'
import { prop, forEach } from 'ramda'
import produce from 'immer'
import useSelectionStore from '../stores/selection'
import useModelStore from '../stores/model'

export default SelectionGl

// - for each mesh, generate 2d screen box
//   - https://stackoverflow.com/a/45879073
// - generate selected bounds
//   - startPoint and Box2.expandByPoint(endPoint)
// - if selected bounds includes mesh box, it's in
//   - Box2.containsBox
//

function SelectionGl (props) {
  const isSelecting = useSelectionStore(prop('isSelecting'))
  const startPoint = useSelectionStore(prop('startPoint'))
  const endPoint = useSelectionStore(prop('endPoint'))
  const isEnabled = useSelectionStore(prop('isEnabled'))
  const selectableScreenBounds = useSelectionStore(
    prop('selectableScreenBounds')
  )
  const updateSelectableScreenBounds = useSelectionStore(
    prop('updateSelectableScreenBounds')
  )
  const selects = useModelStore(prop('selects'))

  const { scene, camera } = useThree()
  // this optimization works because the camera doesn't move once selecting
  React.useEffect(() => {
    if (!isEnabled) return
    if (!isSelecting) return
    updateSelectableScreenBounds({ scene, camera })
  }, [isEnabled, isSelecting])

  const selectionScreenBounds = React.useMemo(() => {
    var box = new THREE.Box2()
    box.makeEmpty()
    box.expandByPoint(new THREE.Vector2(startPoint.x, startPoint.y))
    box.expandByPoint(new THREE.Vector2(endPoint.x, endPoint.y))
    return box
  }, [startPoint, endPoint])

  React.useEffect(() => {
    if (!isEnabled) return
    if (!isSelecting) return

    var selections = []
    Object.entries(selectableScreenBounds).forEach(([uuid, selectableBox]) => {
      if (selectionScreenBounds.containsBox(selectableBox)) {
        selections.push(uuid)
      }
    })
    console.log('selects', selections)
    selects(selections)
  }, [isEnabled, isSelecting, selectionScreenBounds, selectableScreenBounds])

  return null
}
