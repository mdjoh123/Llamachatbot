export type SceneShape =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "torusKnot"
  | "dodecahedron"
  | "icosahedron"
  | "octahedron"

export type SceneAnimation = "none" | "rotate" | "float" | "spin-fast" | "orbit" | "pulse"

export interface SceneObject {
  shape: SceneShape
  color: string
  position: [number, number, number] | number[]
  scale: number
  metalness: number
  roughness: number
  animation: SceneAnimation
}

export interface Scene {
  title: string
  description: string
  background: string
  ambientIntensity: number
  objects: SceneObject[]
}
