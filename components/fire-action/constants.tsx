
import React from 'react';
import { Bell, PhoneCall, Flame, DoorOpen, LogOut, MapPin } from 'lucide-react';
import { Step, Notice } from './types';

export const DISCOVERY_STEPS: Step[] = [
  {
    id: 1,
    variant: 'blue',
    icon: <Bell size={24} />,
    title: 'Raise the Alarm',
    description: "Push the fire call point to raise the alarm. Shout 'Fire' and alert neighbours."
  },
  {
    id: 2,
    variant: 'blue',
    icon: <PhoneCall size={24} />,
    title: 'Call Emergency Services',
    description: 'Dial 999 and give clear details of the location to the operator.'
  },
  {
    id: 3,
    variant: 'red',
    icon: <Flame size={24} />,
    title: 'Attack Fire',
    description: 'Attempt to tackle the fire and put it out, only if it is safe to do so.'
  }
];

export const RESPONSE_STEPS: Step[] = [
  {
    id: 4,
    variant: 'green',
    icon: <LogOut size={24} />,
    title: 'Leave Building',
    description: 'Evacuate via the nearest signed route. Walk, do not run.'
  },
  {
    id: 5,
    variant: 'amber',
    icon: <DoorOpen size={24} />,
    title: 'Close All Doors',
    description: 'Close doors behind you to contain fire. Do not lock them.'
  },
  {
    id: 6,
    variant: 'green',
    icon: <MapPin size={24} />,
    title: 'Report to Assembly Point',
    description: 'Assemble across the road at the corner of Caledonian Crescent & Orwell Terrace. Keep clear of the road.'
  }
];

export const NOTICES: Notice[] = [
  {
    variant: 'amber',
    title: 'FIRE ALARM TESTING',
    items: [
      'The care taker is responsible for testing the fire alarm every Wednesday at approximately 10:00 AM. This will usually sound for up to a minute or so and no action is required during the test.',
      'If the alarm sounds for longer, or there is signs of a fire or smell of smoke, please use common sense and evacuate the building.'
    ]
  },
  {
    variant: 'red',
    title: 'SAFETY NOTICE',
    items: [
      'Do not take personal risks.',
      'Do not return to the building until it has been confirmed it is safe to do so or instructed by the Fire Service or other responsible person.',
      'Do not use lifts in the event of a fire.'
    ]
  }
];
