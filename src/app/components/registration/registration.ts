import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  registrationForm: FormGroup;
  submittedData: any = null;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      mobiles: this.fb.array([
        this.createMobileControl()
      ]),
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  get mobiles(): FormArray {
    return this.registrationForm.get('mobiles') as FormArray;
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  createMobileControl(): FormControl {
    return this.fb.control('', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]);
  }

  addMobile(): void {
    this.mobiles.push(this.createMobileControl());
  }

  removeMobile(index: number): void {
    this.mobiles.removeAt(index);
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.submittedData = null;
    while (this.mobiles.length > 1) {
      this.mobiles.removeAt(this.mobiles.length - 1);
    }
    this.mobiles.at(0).reset();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submittedData = { ...this.registrationForm.value };
      this.resetForm();
    }
  }

  getMobileControl(index: number): FormControl {
    return this.mobiles.at(index) as FormControl;
  }
}
