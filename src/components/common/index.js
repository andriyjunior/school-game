/**
 * Common Components Barrel Export
 *
 * Import components like this:
 * import { Button, Modal, Input, Card, Alert } from './components/common';
 */

// Button components
import ButtonComponent, { BackButton, HelpButton, SubmitButton } from './Button.jsx';
export { BackButton, HelpButton, SubmitButton };
export const Button = ButtonComponent;

// Modal components
import ModalComponent, { ModalHeader, ModalBody, ModalFooter } from './Modal.jsx';
export { ModalHeader, ModalBody, ModalFooter };
export const Modal = ModalComponent;

// Input components
import InputComponent, { Textarea } from './Input.jsx';
export { Textarea };
export const Input = InputComponent;

// Card components
import CardComponent, { StatCard } from './Card.jsx';
export { StatCard };
export const Card = CardComponent;

// Alert components
import AlertComponent, { SuccessAlert, ErrorAlert, WarningAlert, InfoAlert } from './Alert.jsx';
export { SuccessAlert, ErrorAlert, WarningAlert, InfoAlert };
export const Alert = AlertComponent;
