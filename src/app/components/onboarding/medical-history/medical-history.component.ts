import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  AllergiesService,
  OnboardingService,
  NotificationService,
  ConditionsService,
  MedicationsService
} from 'src/app/services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { OnboardingRequestModel } from '../../../models/index';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.less']
})
export class MedicalHistoryComponent implements OnInit {
  public model: any;

  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  public haveAllergies = false;
  public haveConditions = false;
  public takingMedications = false;
  public disableNext = false;

  public allergies = [];
  public conditions = [];
  public medications = [];

  public allergiesModels = [];
  public conditionsModels = [];
  public medicationsModel = [];

  public selectedAllergies = [{ display_value: null }];
  public selectedConditions = [{ display_value: null }];
  public selectedMedications = [{ display_value: null }];

  constructor(
    private allergieSrv: AllergiesService,
    private conditionSrv: ConditionsService,
    private medicationSrv: MedicationsService,
    private onboardingSrv: OnboardingService,
    private notificationSrv: NotificationService
  ) {
    this.getAllergies();
    this.getConditions();
    this.getMedications();
  }

  ngOnInit() {}

  onChangeAllergies(newValue, i) {
    if (newValue instanceof Object) {
      const index = this.selectedAllergies.findIndex(
        ind => ind.display_value === newValue.display_value
      );
      if (this.selectedAllergies.length === 0) {
        this.selectedAllergies.push(newValue);
      } else {
        if (index > -1) {
          this.allergiesModels.splice(index, 1);
          this.notificationSrv.showError('This allergy is already selected.');
        } else {
          this.selectedAllergies.push(newValue);
        }
      }
    } else {
      if (
        newValue.length === 0 ||
        newValue === '' ||
        newValue === null ||
        newValue === undefined
      ) {
        this.selectedAllergies.splice(i + 1, 1);
        this.allergiesModels.splice(i, 1);
      }
    }
    console.log(this.selectedAllergies);
    this.validateUserSelections();
  }

  onChangeConditions(newValue, i) {
    if (newValue instanceof Object) {
      const index = this.selectedConditions.findIndex(
        ind => ind.display_value === newValue.display_value
        // tslint:disable-next-line: semicolon
      );
      if (this.selectedConditions.length === 0) {
        this.selectedConditions.push(newValue);
      } else {
        if (index > -1) {
          this.conditionsModels.splice(index, 1);
          this.notificationSrv.showError('This condition is already selected.');
        } else {
          this.selectedConditions.push(newValue);
        }
      }
    } else {
      if (
        newValue.length === 0 ||
        newValue === '' ||
        newValue === null ||
        newValue === undefined
      ) {
        this.selectedConditions.splice(i + 1, 1);
        this.conditionsModels.splice(i, 1);
      }
    }
    console.log(this.selectedConditions);
    this.validateUserSelections();
  }

  onChangeMedications(newValue, i) {
    if (newValue instanceof Object) {
      const index = this.selectedMedications.findIndex(
        ind => ind.display_value === newValue.display_value
      );
      if (this.selectedMedications.length === 0) {
        this.selectedMedications.push(newValue);
      } else {
        if (index > -1) {
          this.medicationsModel.splice(index, 1);
          this.notificationSrv.showError(
            'This medication/supplement is already selected.'
          );
        } else {
          this.selectedMedications.push(newValue);
        }
      }
    } else {
      if (
        newValue.length === 0 ||
        newValue === '' ||
        newValue === null ||
        newValue === undefined
      ) {
        this.selectedMedications.splice(i + 1, 1);
        this.medicationsModel.splice(i, 1);
      }
    }
    console.log(this.selectedMedications);
    this.validateUserSelections();
  }

  searchAllergies = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.allergies
              .filter(
                v =>
                  v.display_value.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
      // tslint:disable-next-line: semicolon
    );

  searchConditions = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.conditions
              .filter(
                v =>
                  v.display_value.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
      // tslint:disable-next-line: semicolon
    );

  searchMedications = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.medications
              .filter(
                v =>
                  v.display_value.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
      // tslint:disable-next-line: semicolon
    );

  formatter = (x: { display_value: string }) => x.display_value;

  compareWithFunc(a, b) {
    return a.display_value === b.display_value;
  }

  userAction(action: string) {
    const step = action === 'back' ? (this.step = 1) : (this.step = 3);
    this.action.emit(step);
  }

  getAllergies() {
    this.allergieSrv.getAllergies().subscribe(response => {
      if (!response.HasError) {
        this.allergies = response.Result;
        this.loadAllergies();
      }
    });
  }

  getConditions() {
    this.conditionSrv.getConditions().subscribe(
      response => {
        if (!response.HasError) {
          this.conditions = response.Result;
          this.loadConditions();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getMedications() {
    this.medicationSrv.getMedicationSupplements().subscribe(
      response => {
        if (!response.HasError) {
          this.medications = response.Result;
          this.loadMedications();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  nextStep() {
    const myAllergies = JSON.stringify(this.selectedAllergies);
    const myConditions = JSON.stringify(this.selectedConditions);
    const myMedications = JSON.stringify(this.selectedMedications);

    const onboardingModel = new OnboardingRequestModel();
    onboardingModel.myAllergies = myAllergies;
    onboardingModel.myConditions = myConditions;
    onboardingModel.myMedicationSupplements = myMedications;
    onboardingModel.currentStep = this.step;

    this.onboardingSrv.onboarding(onboardingModel).subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          this.userAction('advance');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  allergyModelChange() {
    if (!this.haveAllergies) {
      this.allergiesModels = [];
      this.selectedAllergies = [{ display_value: null }];
    }
    this.validateUserSelections();
  }

  conditionModelChange() {
    if (!this.haveConditions) {
      this.conditionsModels = [];
      this.selectedConditions = [{ display_value: null }];
    }
    this.validateUserSelections();
  }

  medicationModelChange() {
    if (!this.takingMedications) {
      this.medicationsModel = [];
      this.selectedMedications = [{ display_value: null }];
    }
    this.validateUserSelections();
  }

  validateUserSelections() {
    console.log(this.selectedAllergies.length);
    if (this.haveAllergies && this.selectedAllergies.length === 1) {
      this.disableNext = true;
    } else if (this.haveConditions && this.selectedConditions.length === 1) {
      this.disableNext = true;
    } else if (
      this.takingMedications &&
      this.selectedMedications.length === 1
    ) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }

    console.log('disabled next: ', this.disableNext);
    return this.disableNext;
  }

  loadAllergies() {
    const onboardingInfo = new OnboardingRequestModel();
    onboardingInfo.currentStep = this.step;
    this.onboardingSrv.getOnboardingInfo(onboardingInfo).subscribe(
      response => {
        if (!response.HasError && response.Result) {
          const myAllergies = JSON.parse(response.Result.allergies);
          this.selectedAllergies = myAllergies;
          for (let i = 1; i < myAllergies.length; i++) {
            this.allergiesModels.push(myAllergies[i]);
          }
          this.haveAllergies = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  loadConditions() {
    const onboardingInfo = new OnboardingRequestModel();
    onboardingInfo.currentStep = this.step;
    this.onboardingSrv.getOnboardingInfo(onboardingInfo).subscribe(
      response => {
        if (!response.HasError && response.Result) {
          const myConditions = JSON.parse(response.Result.conditions);
          this.selectedConditions = myConditions;
          for (let i = 1; i < myConditions.length; i++) {
            this.conditionsModels.push(myConditions[i]);
          }
          this.haveConditions = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  loadMedications() {
    const onboardingInfo = new OnboardingRequestModel();
    onboardingInfo.currentStep = this.step;
    this.onboardingSrv.getOnboardingInfo(onboardingInfo).subscribe(
      response => {
        if (!response.HasError && response.Result) {
          const myMedications = JSON.parse(
            response.Result.medications.medications_supplements
          );
          this.selectedMedications = myMedications;
          for (let i = 1; i < myMedications.length; i++) {
            this.medicationsModel.push(myMedications[i]);
          }
          this.takingMedications = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
