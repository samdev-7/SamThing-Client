/**
 * Hardware button mappings for the device
 * Screen: 800x480
 * Buttons: 4 top buttons + wheel button + back button + menu button
 */

// Top buttons (left to right)
export const BUTTON_TOP_1 = 'Digit1'
export const BUTTON_TOP_2 = 'Digit2'
export const BUTTON_TOP_3 = 'Digit3'
export const BUTTON_TOP_4 = 'Digit4'

// Top right menu button
export const BUTTON_MENU = 'KeyM'

// Wheel and control buttons
export const BUTTON_WHEEL_PRESS = 'Enter' // Center wheel button (select/confirm)
export const BUTTON_BACK = 'Escape' // Bottom right button (back/cancel)

// Wheel rotation
export const WHEEL_STEPS_PER_ROTATION = 18 // 18 steps = 360 degrees
export const DEGREES_PER_STEP = 360 / WHEEL_STEPS_PER_ROTATION // 20 degrees per step
