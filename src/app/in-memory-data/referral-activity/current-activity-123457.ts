export const REFERRAL_CURRENT_ACTIVITY_123457 = {
  id: 313233343537,
  response: {
    currentActivityCards: [
      {
        title: 'One Call Care Mgmt',
        iconInfo: null,
        serviceType: null,
        status: 'Denied',
        date: '02/17/2017',
        time: '09:00 AM',
        body: [['P:800-834-(5360)', 'F:(357)-845-8588']],
        footer: {
          color: 'success',
          text: 'Denied',
          subText: 'Waiting on Requestor'
        },
        subText: [],
        stage: 'vendorAssignment',
        modalData: null,
        tableRow: {
          date: '02/17/2017',
          stage: 'vendorAssignment',
          actionDetail:
            'One Call Care Mgmt - P:800-834-(5360), F:(357)-845-8588',
          notes: 'Waiting on Requestor',
          status: 'Denied',
          failureStatus: true
        }
      },
      {
        title: 'Homelink',
        iconInfo: null,
        serviceType: null,
        status: 'Pending',
        date: '01/17/2017',
        time: '11:00 PM',
        body: [['P:866-834-5360']],
        footer: {
          color: 'success',
          text: 'Pending',
          subText: 'Waiting on Requestor'
        },
        subText: [],
        stage: 'vendorAssignment',
        modalData: null,
        tableRow: {
          date: '01/17/2017',
          stage: 'vendorAssignment',
          actionDetail: 'Homelink - P:866-834-5360',
          notes: 'Waiting on Requestor',
          status: 'Pending',
          failureStatus: false
        }
      },
      {
        title: '2nd Attempt',
        iconInfo: null,
        serviceType: null,
        status: 'Contact Attempt Unsuccessful',
        date: '05/13/2019',
        time: '11:00 PM',
        body: [],
        footer: {
          color: 'fail',
          text: 'Contact Attempt Unsuccessful',
          subText: null
        },
        subText: ['By: Alan Marshall'],
        stage: 'scheduleService',
        modalData: {
          date: '05/13/2019',
          time: '11:00 PM',
          contactName: 'Alan Marshall',
          attempt: '2nd Attempt',
          contactType: 'Claimant',
          contactMethod: 'Phone',
          contactAttemptNote:
            'Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again1. Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again2. Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again3. Address: WISDOM PHYSICAL THERAPY INC. 426 N IMPERIAL AVE, EL CENTRO, CA 9224. Enjoy Testing!!'
        },
        tableRow: {
          date: '05/13/2019',
          stage: 'scheduleService',
          actionDetail:
            '2nd Attempt - 05/13/2019 - 11:00 PM - By: Alan Marshall',
          notes:
            'Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again1. Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again2. Called patient (123-456-7089) left voice message to confirm if he received the stockings. Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship. Called again and again3. Address: WISDOM PHYSICAL THERAPY INC. 426 N IMPERIAL AVE, EL CENTRO, CA 9224. Enjoy Testing!!',
          status: 'Contact Attempt Unsuccessful',
          failureStatus: true
        }
      },
      {
        title: '1st Attempt',
        iconInfo: null,
        serviceType: null,
        status: 'Contact Attempt Successful',
        date: '02/13/2019',
        time: '02:00 PM',
        body: [],
        footer: {
          color: 'success',
          text: 'Contact Attempt Successful',
          subText: null
        },
        subText: ['By: Bob Smith'],
        stage: 'scheduleService',
        modalData: {
          date: '02/13/2019',
          time: '02:00 PM',
          contactName: 'Bob Smith',
          attempt: '1st Attempt',
          contactType: 'Claimant',
          contactMethod: 'Phone',
          contactAttemptNote:
            'Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship.Address: WISDOM PHYSICAL THERAPY INC. 426 N IMPERIAL AVE, EL CENTRO, CA 9224!! Call again and again.'
        },
        tableRow: {
          date: '02/13/2019',
          stage: 'scheduleService',
          actionDetail: '1st Attempt - 02/13/2019 - 02:00 PM - By: Bob Smith',
          notes:
            'Called patient (123-456-7089) left voice message to obtain measurements for stockings and confirm address to ship.Address: WISDOM PHYSICAL THERAPY INC. 426 N IMPERIAL AVE, EL CENTRO, CA 9224!! Call again and again.',
          status: 'Contact Attempt Successful',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (3/3)',
        iconInfo: {
          icon: 'SEDAN',
          iconText: "Dan's Taxi Service"
        },
        serviceType: 'Sedan',
        status: 'Billed',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched. DOS:10/15/2019'],
          ['Sched.Pickup Time: 10:30 AM', 'Sched.Drop-Off Time: 11:30 AM'],
          [
            'Sched.To Address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: null,
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (3/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '26 Miles',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (2/3) - Cancelled',
        iconInfo: {
          icon: 'SEDAN',
          iconText: 'Uber'
        },
        serviceType: 'Sedan',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched. DOS:09/26/2019'],
          ['13:30 AM', 'Reason: He fell asleep']
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: null,
        stage: 'serviceScheduled',
        modalData: null,
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Cancelled',
          failureStatus: true
        }
      },
      {
        title: 'Sedan (1/3)',
        iconInfo: {
          icon: 'SEDAN',
          iconText: 'Lyft'
        },
        serviceType: 'Sedan',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched. DOS:09/25/2019'],
          ['Sched.Pickup Time: 13:30 AM', 'Sched.Drop-Off Time: 14:30 AM'],
          [
            'Sched.To Address:',
            "Doctor's Office 1",
            '456 E Kennedy Blvd',
            'Suite A',
            'Tampa, FL 33629'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: null,
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (1/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '12/08/2019',
            status: 'Paid',
            vendor: 'Homelinker',
            totalMileage: '42 Miles',
            numberOfTravelers: '1'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Flight (1/3)',
        iconInfo: {
          icon: 'FLIGHT',
          iconText: 'LACSA'
        },
        serviceType: 'Flight',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched.DOS: 12/17/2019'],
          ['Sched. Departure: MCO 10:30 AM'],
          ['Sched. Arrival: FLL 12:00 PM']
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'FLIGHT_SERVICE',
          title: 'Flight (1/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            numberOfTravelers: '2'
          },
          itineraryData: {
            legData: [
              {
                flyingFrom: 'TPA',
                flyingTo: 'LAX',
                departure: '12/15/18 10:30 AM',
                arrival: '12/15/18 6:30 PM',
                carrier: 'American Airlines Scheduled',
                flightNumber: 'D2345'
              },
              {
                flyingFrom: 'LAX',
                flyingTo: 'TPA',
                departure: '12/16/18 9:00 AM',
                arrival: '12/16/18 11:00 PM',
                carrier: 'Delta Scheduled',
                flightNumber: 'D9823'
              }
            ],
            appointmentInfo: {
              appointmentType: 'Surgery',
              appointmentDateAndTime: '12/15/18 11:30 AM',
              doctorNameAndSpec: 'Dr. Jane Jones - Orthopedic'
            }
          }
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Wheelchair (1/3)',
        iconInfo: {
          icon: 'WHEELCHAIR',
          iconText: "Jordan's Wheelchair Van"
        },
        serviceType: 'Wheelchair',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched.DOS: 12/17/2019'],
          ['Sched. Pickup Time: 10:30 AM', 'Sched. Drop-Off Time: 11:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Wheelchair (1/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '10 Miles',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Other (1/3)',
        iconInfo: {
          icon: 'OTHER',
          iconText: 'Ambulance'
        },
        serviceType: 'Other',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          ['Sched. DOS: 12/17/2019'],
          ['Sched. Pickup Time: 10:30 AM', 'Sched. Drop-Off Time: 11:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Other (1/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '26 Miles',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Lodging (1/3)',
        iconInfo: {
          icon: 'LODGING',
          iconText: 'Hilton Airport'
        },
        serviceType: 'Lodging',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [
          [''],
          ['Sched. Check-in: 12/15/18', 'Sched. Check-out: 12/19/18'],
          ['Lodging Address:', '1255 Westmore Ave.', 'Temple Terrace, FL 33637']
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'serviceScheduled',
        modalData: {
          modalType: 'LODGING_SERVICE',
          title: 'Lodging (1/3)',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            nights: '4',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              lodgingName: 'Best Western',
              address: [
                'Best Western #324',
                '1234 Street',
                'Cities Ville, FL 12345'
              ],
              contactInfo: 'Ph. (123) 456-7890',
              checkinDate: '12/15/18',
              checkoutDate: '12/18/18',
              nightlyCost: '125',
              amenities: '25',
              appointmentInfo: {
                appointmentType: 'Surgery',
                appointmentDateAndTime: ['12/16/2018', '11:30 AM'],
                doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'serviceScheduled',
          actionDetail:
            "Sedan (3/3) - 10/14/2019 - Car Ride - From address: Doctor's Office, 456 E Kennedy Blvd, Suite A, Tampa, FL 33609To address: cvs pharmacy, 7909 fowler ave, university plaza, Temple Terrace, FL 33637 - ",
          notes: null,
          status: 'Billed',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (3/3) - Completed',
        iconInfo: {
          icon: 'SEDAN',
          iconText: "Dan's Taxi Service"
        },
        serviceType: 'Sedan',
        status: 'Completed',
        date: '10/24/2019',
        time: null,
        body: [
          ['DOS: 12/16/2019'],
          ['Pickup Time: 10:30 AM', 'Drop-Off Time: 11:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (3/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '26 Miles',
            totalCost: '$48',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/24/2019',
          stage: 'results',
          actionDetail:
            'Sedan (3/3)-Completed - 10/24/2019 - Pickup Time: 03:34 PM - cvs pharmacy',
          notes: null,
          status: 'Completed',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (2/3) - Completed',
        iconInfo: {
          icon: 'SEDAN',
          iconText: 'Uber'
        },
        serviceType: 'Sedan',
        status: 'Completed',
        date: '10/14/2019',
        time: null,
        body: [
          ['DOS: 12/16/2019'],
          ['Pickup Time: 14:30 AM', 'Drop-Off Time: 15:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (2/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '22 Miles',
            totalCost: '$42',
            numberOfTravelers: '2'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Uber',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            },
            {
              transportationServiceName: 'Junkos Fast Cab Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 5,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 4.75,
                driverLanguage: 'Spanish'
              }
            }
          ]
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'results',
          actionDetail:
            'Sedan (2/3)-Completed - 10/14/2019 - Pickup Time: 03:34 PM - ',
          notes: null,
          status: 'Completed',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (1/3) - Missed',
        iconInfo: {
          icon: 'SEDAN',
          iconText: null
        },
        serviceType: 'Sedan',
        status: 'Scheduled',
        date: '10/09/2019',
        time: null,
        body: [['DOS: 12/17/2019'], ['10:30 AM', 'Reason: IW was a no show']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: null,
        tableRow: {
          date: '10/09/2019',
          stage: 'results',
          actionDetail:
            "Sedan (1/3)-Scheduled - 10/09/2019 - Pickup Time: 03:34 PM - Doctor's Office 1",
          notes: null,
          status: 'Missed',
          failureStatus: true
        }
      },
      {
        title: 'Flight (1/3) - Completed',
        iconInfo: {
          icon: 'FLIGHT',
          iconText: 'LACSA'
        },
        serviceType: 'Flight',
        status: 'Scheduled',
        date: '10/09/2019',
        time: null,
        body: [
          ['DOS: 12/17/2019'],
          ['Departure: MCO 10:30 AM'],
          ['Arrival: FLL 12:00 PM']
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'FLIGHT_SERVICE',
          title: 'Flight (1/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalCost: '$340',
            numberOfTravelers: '4'
          },
          itineraryData: {
            legData: [
              {
                flyingFrom: 'TPA',
                flyingTo: 'LAX',
                departure: '12/15/18 10:30 AM',
                arrival: '12/15/18 6:30 PM',
                carrier: 'American Airlines Scheduled',
                flightNumber: 'D2345'
              },
              {
                flyingFrom: 'LAX',
                flyingTo: 'TPA',
                departure: '12/16/18 9:00 AM',
                arrival: '12/16/18 11:00 PM',
                carrier: 'Delta Scheduled',
                flightNumber: 'D9823'
              }
            ],
            appointmentInfo: {
              appointmentType: 'Surgery',
              appointmentDateAndTime: '12/15/18 11:30 AM',
              doctorNameAndSpec: 'Dr. Jane Jones - Orthopedic'
            }
          }
        },
        tableRow: {
          date: '10/09/2019',
          stage: 'results',
          actionDetail:
            "Sedan (1/3)-Scheduled - 10/09/2019 - Pickup Time: 03:34 PM - Doctor's Office 1",
          notes: null,
          status: 'Scheduled',
          failureStatus: false
        }
      },
      {
        title: 'Wheelchair (1/3) - Completed',
        iconInfo: {
          icon: 'WHEELCHAIR',
          iconText: "Beatriz Pinzon's Wheelchair Van"
        },
        serviceType: 'Wheelchair',
        status: 'Scheduled',
        date: '10/09/2019',
        time: null,
        body: [
          ['DOS: 12/17/2019'],
          ['Pickup Time: 10:30 AM', 'Drop-Off Time: 11:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Wheelchair (1/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '27 Miles',
            totalCost: '$342',
            numberOfTravelers: '1'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/09/2019',
          stage: 'results',
          actionDetail:
            "Sedan (1/3)-Scheduled - 10/09/2019 - Pickup Time: 03:34 PM - Doctor's Office 1",
          notes: null,
          status: 'Scheduled',
          failureStatus: false
        }
      },
      {
        title: 'Other (1/3) - Completed',
        iconInfo: {
          icon: 'OTHER',
          iconText: 'Ambulance'
        },
        serviceType: 'Other',
        status: 'Scheduled',
        date: '10/09/2019',
        time: null,
        body: [
          ['DOS: 12/17/2019'],
          ['Pickup Time: 10:30 AM', 'Drop-Off Time: 11:00 AM'],
          [
            'To address:',
            'cvs pharmacy',
            '7909 fowler ave',
            'university plaza',
            'Temple Terrace, FL 33637'
          ]
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Other (1/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalMileage: '67 Miles',
            totalCost: '$30',
            numberOfTravelers: '4'
          },
          itineraryData: [
            {
              transportationServiceName: 'Bobs Taxi Service',
              mileageTab: {
                destination: 'Acme Clinic',
                fromAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                toAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                pickupTime: '10:30 AM',
                dropOffTime: '11:00 AM',
                mileage: '13',
                cost: '24',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 3,
                contactInfo: 'Ph. (123) 456-7890',
                driverRating: 3.75,
                driverLanguage: 'Spanish'
              }
            },
            {
              transportationServiceName: 'Lyft',
              mileageTab: {
                destination: 'Home',
                fromAddr: ['1622 Beach St.', 'Tampa, Fl 33630'],
                toAddr: ['1255 Westmore Ave.', 'Tampa, Fl 33630'],
                pickupTime: '02:00 PM',
                dropOffTime: '3:00 PM',
                mileage: '13',
                cost: '16',
                appointmentInfo: {
                  appointmentType: 'Surgery',
                  appointmentDateAndTime: ['04/15/2020', '11:30 AM'],
                  doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
                }
              },
              driverTab: {
                stars: 4,
                contactInfo: 'Ph. (800) 555-1212',
                driverRating: 2.5,
                driverLanguage: 'English'
              }
            }
          ]
        },
        tableRow: {
          date: '10/09/2019',
          stage: 'results',
          actionDetail:
            "Sedan (1/3)-Scheduled - 10/09/2019 - Pickup Time: 03:34 PM - Doctor's Office 1",
          notes: null,
          status: 'Scheduled',
          failureStatus: false
        }
      },
      {
        title: 'Lodging (1/3) - Completed',
        iconInfo: {
          icon: 'LODGING',
          iconText: 'Best Western Florida'
        },
        serviceType: 'Lodging',
        status: 'Scheduled',
        date: '10/09/2019',
        time: null,
        body: [
          [''],
          ['Check-in: 12/15/18', 'Check-out: 12/19/18'],
          ['Lodging Address:', '1255 Westmore Ave.', 'Temple Terrace, FL 33637']
        ],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'results',
        modalData: {
          modalType: 'LODGING_SERVICE',
          title: 'Lodging (1/3) - Completed',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            nights: '5',
            totalCost: '$3',
            numberOfTravelers: '48'
          },
          itineraryData: [
            {
              lodgingName: 'Best Western',
              address: [
                'Best Western #324',
                '1234 Street',
                'Cities Ville, FL 12345'
              ],
              contactInfo: 'Ph. (123) 456-7890',
              checkinDate: '12/15/18',
              checkoutDate: '12/18/18',
              nightlyCost: '125',
              amenities: '25',
              appointmentInfo: {
                appointmentType: 'Surgery',
                appointmentDateAndTime: ['12/16/2018', '11:30 AM'],
                doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
              }
            },
            {
              lodgingName: 'Best Western',
              address: [
                'Best Western #324',
                '1234 Street',
                'Cities Ville, FL 12345'
              ],
              contactInfo: 'Ph. (123) 456-7890',
              checkinDate: '12/15/18',
              checkoutDate: '12/18/18',
              nightlyCost: '125',
              amenities: '45',
              appointmentInfo: {
                appointmentType: 'Surgery',
                appointmentDateAndTime: ['12/16/2018', '11:30 AM'],
                doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
              }
            },
            {
              lodgingName: 'Best Western',
              address: [
                'Best Western #324',
                '1234 Street',
                'Cities Ville, FL 12345'
              ],
              contactInfo: 'Ph. (123) 456-7890',
              checkinDate: '12/15/18',
              checkoutDate: '12/18/18',
              nightlyCost: '125',
              amenities: '35',
              appointmentInfo: {
                appointmentType: 'Surgery',
                appointmentDateAndTime: ['12/16/2018', '11:30 AM'],
                doctorNameAndSpec: 'Dr. Jane Jones - Orthopedics'
              }
            }
          ]
        },
        tableRow: {
          date: '10/09/2019',
          stage: 'results',
          actionDetail:
            "Sedan (1/3)-Scheduled - 10/09/2019 - Pickup Time: 03:34 PM - Doctor's Office 1",
          notes: null,
          status: 'Scheduled',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (2/2) - Bill Submitted',
        iconInfo: {
          icon: 'SEDAN',
          iconText: "Dan's Taxi Service"
        },
        serviceType: 'Sedan',
        status: 'Billing Requested',
        date: '10/24/2019',
        time: null,
        body: [['DOS:10/24/2019']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (2/2) - Bill Submitted',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Billing Requested',
            vendor: 'Homelink',
            totalCost: '$340'
          }
        },
        tableRow: {
          date: '10/24/2019',
          stage: 'billing',
          actionDetail: 'Billing Requested - 10/24/2019 03:34 PM',
          notes: null,
          status: 'Billing Requested',
          failureStatus: false
        }
      },
      {
        title: 'Sedan (2/4) - Paid',
        iconInfo: {
          icon: 'SEDAN',
          iconText: 'Lyft'
        },
        serviceType: 'Sedan',
        status: 'Test Note for Testing',
        date: '10/09/2019',
        time: null,
        body: [['DOS:10/09/2019']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Sedan (2/4) - Paid',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/06/2019',
            status: 'Paid',
            vendor: 'Homelink2',
            totalCost: '$340'
          }
        },
        tableRow: {
          date: '10/09/2019',
          stage: 'billing',
          actionDetail: 'Test Note for Testing - 10/09/2019 03:34 PM',
          notes: null,
          status: 'Test Note for Testing',
          failureStatus: false
        }
      },
      {
        title: 'Flight (1/3)-Paid',
        iconInfo: {
          icon: 'FLIGHT',
          iconText: 'LACSA'
        },
        serviceType: 'Flight',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [['DOS: 12/17/2019']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'FLIGHT_SERVICE',
          title: 'Flight (1/3)-Paid',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2021',
            status: 'Paid',
            vendor: 'Homelink',
            totalCost: '$40'
          }
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'billing',
          actionDetail: 'Billing Requested for completed - 10/14/2019 03:34 PM',
          notes: null,
          status: 'Billing Requested for completed',
          failureStatus: false
        }
      },
      {
        title: 'Wheelchair (1/3)-Paid',
        iconInfo: {
          icon: 'WHEELCHAIR',
          iconText: "Jordan's Wheelchair Van"
        },
        serviceType: 'Wheelchair',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [['DOS: 12/17/2019']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Wheelchair (1/3)-Paid',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/15/2019',
            status: 'Paid',
            vendor: 'Homelink5',
            totalCost: '$3'
          }
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'billing',
          actionDetail: 'Billing Requested for completed - 10/14/2019 03:34 PM',
          notes: null,
          status: 'Billing Requested for completed',
          failureStatus: false
        }
      },
      {
        title: 'Other (1/3)-Paid',
        iconInfo: {
          icon: 'OTHER',
          iconText: 'Ambulance'
        },
        serviceType: 'Other',
        status: 'Scheduled',
        date: '10/14/2019',
        time: null,
        body: [['DOS: 12/17/2019']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'GROUND_SERVICE',
          title: 'Other (1/3)-Paid',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2020',
            status: 'Paid',
            vendor: 'Homelink',
            totalCost: '$30'
          }
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'billing',
          actionDetail: 'Billing Requested for completed - 10/14/2019 03:34 PM',
          notes: null,
          status: 'Billing Requested for completed',
          failureStatus: false
        }
      },
      {
        title: 'Lodging (1/3)-Paid',
        iconInfo: {
          icon: 'LODGING',
          iconText: 'Hilton Airport'
        },
        serviceType: 'Lodging',
        status: 'Paid',
        date: '10/14/2019',
        time: null,
        body: [['Check-in Date: 12/15/18']],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'billing',
        modalData: {
          modalType: 'LODGING_SERVICE',
          title: 'Lodging (1/3)-Paid',
          vendorCode: 'HL',
          overview: {
            referralId: 123457,
            dateOfService: '11/08/2019',
            status: 'Paid',
            vendor: 'Homelink',
            totalCost: '$40'
          }
        },
        tableRow: {
          date: '10/14/2019',
          stage: 'billing',
          actionDetail: 'Billing Requested for completed - 10/14/2019 03:34 PM',
          notes: null,
          status: 'Billing Requested for completed',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Sedan',
        status: 'Authorized',
        date: '10/28/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/28/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2022; 22 Trips; New Locations',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2022; Qty: 22 Trips; New Locations',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Sedan',
        status: 'Authorized',
        date: '10/24/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/24/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2019; 4 Trips; New Locations',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 4 Trips; New Locations',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Sedan',
        status: 'Authorized',
        date: '10/21/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/21/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Vendor Submitted - 12/05/18 - 01/10/2019; 8 Trips; Requestor/Role - Larry Smith/Adjuster',
          notes: 'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 6 Trips',
          status: 'Pending Authorization',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Lodging',
        status: 'Pending Authorization',
        date: '10/28/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/28/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2022; 22 Nights',
          notes: 'Changes: Date Range - 12/16/18 - 01/10/2022; Qty: 22 Nights',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Lodging',
        status: 'Pending Authorization',
        date: '10/24/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/24/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2019; 4 Nights',
          notes: 'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 4 Nights',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Lodging',
        status: 'Pending Authorization',
        date: '10/21/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/21/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Vendor Submitted - 12/05/18 - 01/10/2019; 8 Nights; Requestor/Role - Larry Smith/Adjuster',
          notes: 'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 6 Nights',
          status: 'Pending Authorization',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Other',
        status: 'Authorized',
        date: '10/28/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/28/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2022; 22 Trips; Ambulance',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2022; Qty: 22 Trips; Ambulance',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Other',
        status: 'Authorized',
        date: '10/24/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/24/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2019; 4 Trips; Ambulance',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 4 Trips; Ambulance',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Other',
        status: 'Authorized',
        date: '10/21/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/21/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Vendor Submitted - 12/05/18 - 01/10/2019; 8 Trips; Ambulance; Requestor/Role - Larry Smith/Adjuster',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 6 Trips; Ambulance',
          status: 'Pending Authorization',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Wheelchair',
        status: 'Pending Authorization',
        date: '10/28/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/28/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2022; 22 Trips; Has Powered Wheelchair',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2022; Qty: 22 Trips; Has Powered Wheelchair',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Wheelchair',
        status: 'Pending Authorization',
        date: '10/24/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/24/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2019; 4 Trips; Has Powered Wheelchair',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 4 Trips; Has Powered Wheelchair',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Wheelchair',
        status: 'Pending Authorization',
        date: '10/21/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/21/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Vendor Submitted - 12/05/18 - 01/10/2019; 8 Trips; Has Powered Wheelchair; Requestor/Role - Larry Smith/Adjuster',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 6 Trips; Has Powered Wheelchair',
          status: 'Pending Authorization',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Flight',
        status: 'Authorized',
        date: '10/28/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/28/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2022; 22 Trips; Airport near appointment',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2022; Qty: 22 Trips; Airport near appointment',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Flight',
        status: 'Authorized',
        date: '10/24/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/24/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Authorized - Larry Smith - 12/05/18 - 01/10/2019; 4 Trips; Airport near appointment',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 4 Trips; Airport near appointment',
          status: 'Authorized',
          failureStatus: false
        }
      },
      {
        title: null,
        iconInfo: null,
        serviceType: 'Flight',
        status: 'Authorized',
        date: '10/21/2018',
        time: null,
        body: [],
        footer: {
          color: 'success',
          text: null,
          subText: null
        },
        subText: [],
        stage: 'authorizationHistory',
        modalData: null,
        tableRow: {
          date: '10/21/2018',
          stage: 'authorizationHistory',
          actionDetail:
            'Vendor Submitted - 12/05/18 - 01/10/2019; 8 Trips; Airport near appointment; Requestor/Role - Larry Smith/Adjuster',
          notes:
            'Changes: Date Range - 12/16/18 - 01/10/2019; Qty: 6 Trips; Airport near appointment',
          status: 'Pending Authorization',
          failureStatus: false
        }
      }
    ],
    statusBar: {
      serviceTypes: ['Sedan', 'Flight', 'Lodging', 'Wheelchair', 'Other'],
      summations: {
        Flight: {
          authorized: '0 trip',
          scheduled: '1 trip',
          completed: '1 trip',
          billed: '1 trip'
        },
        Wheelchair: {
          authorized: '0 trip',
          scheduled: '1 trip',
          completed: '1 trip',
          billed: '1 trip'
        },
        Lodging: {
          authorized: '0 trip',
          scheduled: '1 trip',
          completed: '1 trip',
          billed: '1 trip'
        },
        Sedan: {
          authorized: '3 trips',
          scheduled: '3 trips',
          completed: '2 trips',
          billed: '1 trip'
        },
        Other: {
          authorized: '0 trip',
          scheduled: '1 trip',
          completed: '1 trip',
          billed: '1 trip'
        }
      }
    }
  }
};
