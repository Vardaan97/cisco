'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Phone, Mail, MessageCircle, Calendar, Clock, MapPin, Users, Award,
  ChevronDown, ChevronRight, Search, Filter, CheckCircle, Star,
  Globe, Building2, GraduationCap, ArrowRight, X, Menu,
  Monitor, Shield, Server, Cloud, Zap, TrendingUp,
  BookOpen, Target, BadgeCheck, CreditCard, Headphones, Video,
  Network, Router, Wifi, Lock, Database, Activity,
  ShieldCheck, Key, Fingerprint, Eye, Bug, Terminal, Cpu, HardDrive,
  Cable, Radio, Laptop, Smartphone, Settings, Code, Binary, Webhook
} from 'lucide-react';

// Types
interface Course {
  id: string;
  code: string;
  title: string;
  level: 'Associate' | 'Professional' | 'Expert' | 'Specialist';
  duration: string;
  price: number;
  clcCredits: number;
  category: string;
  description: string;
  schedules: Schedule[];
  prerequisites?: string[];
  examCode?: string;
}

interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  time: string;
  timezone: string;
  mode: 'Live Online' | 'Classroom' | '1-on-1';
  location?: string;
  seatsLeft: number;
  instructor: string;
  guaranteed: boolean;
}

// Real Cisco CLC Schedule Data - Updated from Koenig's official schedule
const ciscoCoursesData: Course[] = [
  {
    id: '1',
    code: 'CCNA 2.2',
    title: 'Implementing and Administering Cisco Solutions (CCNA)',
    level: 'Associate',
    duration: '5 Days',
    price: 2495,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Master the fundamentals of network access, IP connectivity, IP services, security, and automation.',
    examCode: '200-301',
    prerequisites: ['Basic computer literacy', 'Basic PC operating system navigation skills'],
    schedules: [
      { id: 's1', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's2', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's3', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's4', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '2',
    code: 'ENCOR 1.4',
    title: 'Implementing Cisco Enterprise Network Core Technologies (ENCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 3995,
    clcCredits: 64,
    category: 'Enterprise Networking',
    description: 'Gain skills for enterprise network infrastructure including dual stack architecture, virtualization, and automation.',
    examCode: '350-401',
    prerequisites: ['CCNA certification or equivalent knowledge'],
    schedules: [
      { id: 's5', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's6', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's7', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's8', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '3',
    code: 'SCOR 2.0',
    title: 'Implementing and Operating Cisco Security Core Technologies (SCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 4295,
    clcCredits: 64,
    category: 'Security',
    description: 'Learn to implement core security technologies including network security, cloud security, and endpoint protection.',
    examCode: '350-701',
    prerequisites: ['CCNA certification', 'Basic understanding of network security'],
    schedules: [
      { id: 's9', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's10', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's11', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's12', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '4',
    code: 'ENARSI 1.1',
    title: 'Implementing Cisco Enterprise Advanced Routing and Services (ENARSI)',
    level: 'Professional',
    duration: '5 Days',
    price: 3995,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Configure and troubleshoot advanced routing technologies and services in enterprise network environments.',
    examCode: '300-410',
    prerequisites: ['CCNA certification', 'ENCOR course or equivalent'],
    schedules: [
      { id: 's13', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's14', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's15', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's16', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '5',
    code: 'SISE 4.1',
    title: 'Implementing and Configuring Cisco Identity Services Engine (SISE)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4495,
    clcCredits: 40,
    category: 'Security',
    description: 'Deploy and use Cisco ISE for network access control, posture enforcement, and device administration.',
    examCode: '300-715',
    prerequisites: ['CCNA certification', 'Basic understanding of 802.1X'],
    schedules: [
      { id: 's17', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's18', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's19', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's20', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '6',
    code: 'DCCOR 1.4',
    title: 'Implementing and Operating Cisco Data Center Core Technologies (DCCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 4195,
    clcCredits: 64,
    category: 'Data Center',
    description: 'Implement data center technologies including networking, compute, storage networking, and automation.',
    examCode: '350-601',
    prerequisites: ['CCNA certification', 'Understanding of data center technologies'],
    schedules: [
      { id: 's21', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's22', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's23', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's24', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '7',
    code: 'DEVASC 1.1',
    title: 'Developing Applications and Automating Workflows Using Cisco Platforms (DEVASC)',
    level: 'Associate',
    duration: '5 Days',
    price: 2995,
    clcCredits: 48,
    category: 'DevNet',
    description: 'Learn software development and design fundamentals, APIs, and automation for Cisco platforms.',
    examCode: '200-901',
    prerequisites: ['Basic programming knowledge (Python recommended)'],
    schedules: [
      { id: 's25', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's26', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 5, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's27', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's28', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '8',
    code: 'ENSDWI 3.0',
    title: 'Implementing Cisco SD-WAN Solutions (ENSDWI)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4295,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Design, deploy, configure, and manage Cisco SD-WAN solution in a large-scale live network.',
    examCode: '300-415',
    prerequisites: ['CCNA certification', 'Basic understanding of WAN technologies'],
    schedules: [
      { id: 's29', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 4, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's30', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's31', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's32', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '9',
    code: 'DEVCOR 2.0',
    title: 'Developing Applications Using Cisco Core Platforms and APIs (DEVCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 3995,
    clcCredits: 64,
    category: 'DevNet',
    description: 'Advanced software development for Cisco collaboration and enterprise platforms.',
    examCode: '350-901',
    prerequisites: ['DEVASC certification or equivalent knowledge'],
    schedules: [
      { id: 's33', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's34', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's35', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's36', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '10',
    code: 'SPCOR 1.2',
    title: 'Implementing and Operating Cisco Service Provider Network Core Technologies (SPCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 4295,
    clcCredits: 64,
    category: 'Service Provider',
    description: 'Implement and operate core service provider network technologies.',
    examCode: '350-501',
    prerequisites: ['CCNA certification', 'Understanding of SP technologies'],
    schedules: [
      { id: 's37', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's38', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's39', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's40', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '11',
    code: 'CBROPS 1.2',
    title: 'Understanding Cisco Cybersecurity Operations Fundamentals (CBROPS)',
    level: 'Associate',
    duration: '5 Days',
    price: 2995,
    clcCredits: 40,
    category: 'Security',
    description: 'Learn cybersecurity operations fundamentals including security monitoring, host-based analysis, and incident response.',
    examCode: '200-201',
    prerequisites: ['Basic networking knowledge'],
    schedules: [
      { id: 's41', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's42', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's43', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's44', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '12',
    code: 'CBRCOR 1.1',
    title: 'Performing CyberOps Using Cisco Security Technologies (CBRCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 4295,
    clcCredits: 64,
    category: 'Security',
    description: 'Advance your cybersecurity operations skills with threat hunting, incident response, and forensics.',
    examCode: '350-201',
    prerequisites: ['CBROPS certification or equivalent'],
    schedules: [
      { id: 's45', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's46', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's47', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's48', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '13',
    code: 'DCID 7.1',
    title: 'Designing Cisco Data Center Infrastructure (DCID)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4495,
    clcCredits: 40,
    category: 'Data Center',
    description: 'Design data center infrastructure including compute, virtualization, storage, and network.',
    examCode: '300-610',
    prerequisites: ['DCCOR certification or equivalent'],
    schedules: [
      { id: 's49', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's50', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's51', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's52', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '14',
    code: 'SVPN 1.1',
    title: 'Implementing Secure Solutions with Virtual Private Networks (SVPN)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4295,
    clcCredits: 40,
    category: 'Security',
    description: 'Implement secure remote access VPN and site-to-site VPN solutions.',
    examCode: '300-730',
    prerequisites: ['SCOR certification or equivalent'],
    schedules: [
      { id: 's53', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's54', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's55', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's56', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '15',
    code: 'BGP 4.1',
    title: 'Configuring BGP on Cisco Routers (BGP)',
    level: 'Specialist',
    duration: '5 Days',
    price: 3995,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Deep dive into BGP configuration, optimization, and troubleshooting on Cisco routers.',
    examCode: 'N/A',
    prerequisites: ['CCNA certification', 'ENCOR or equivalent'],
    schedules: [
      { id: 's57', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's58', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's59', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's60', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '16',
    code: 'MPLS 3.1',
    title: 'Implementing Cisco MPLS (MPLS)',
    level: 'Specialist',
    duration: '5 Days',
    price: 3995,
    clcCredits: 40,
    category: 'Service Provider',
    description: 'Configure and troubleshoot MPLS including MPLS TE, MPLS VPN, and QoS.',
    examCode: 'N/A',
    prerequisites: ['CCNA certification', 'BGP knowledge'],
    schedules: [
      { id: 's61', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's62', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's63', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's64', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '17',
    code: 'ENWLSD 2.0',
    title: 'Designing Cisco Enterprise Wireless Networks (ENWLSD)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4295,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Design enterprise wireless networks including site surveys and RF design.',
    examCode: '300-425',
    prerequisites: ['CCNA certification', 'ENCOR or equivalent'],
    schedules: [
      { id: 's65', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's66', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's67', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's68', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '18',
    code: 'CLCOR 1.3',
    title: 'Implementing Cisco Collaboration Core Technologies (CLCOR)',
    level: 'Professional',
    duration: '5 Days',
    price: 4195,
    clcCredits: 64,
    category: 'Collaboration',
    description: 'Implement collaboration core technologies including infrastructure, protocols, and gateways.',
    examCode: '350-801',
    prerequisites: ['CCNA certification', 'Basic collaboration knowledge'],
    schedules: [
      { id: 's69', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's70', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's71', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's72', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '19',
    code: '802.1X 3.0',
    title: 'Implementing 802.1X Network Access (802.1X)',
    level: 'Specialist',
    duration: '3 Days',
    price: 2695,
    clcCredits: 24,
    category: 'Security',
    description: 'Implement and troubleshoot 802.1X network access control.',
    examCode: 'N/A',
    prerequisites: ['CCNA certification', 'Basic security knowledge'],
    schedules: [
      { id: 's73', startDate: '2026-01-05', endDate: '2026-01-07', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's74', startDate: '2026-01-05', endDate: '2026-01-07', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's75', startDate: '2026-01-12', endDate: '2026-01-14', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's76', startDate: '2026-01-12', endDate: '2026-01-14', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '20',
    code: 'PRNE 2.0',
    title: 'Programming for Network Engineers (PRNE)',
    level: 'Associate',
    duration: '4 Days',
    price: 2495,
    clcCredits: 32,
    category: 'DevNet',
    description: 'Learn Python programming fundamentals for network automation.',
    examCode: 'N/A',
    prerequisites: ['Basic networking knowledge'],
    schedules: [
      { id: 's77', startDate: '2026-01-05', endDate: '2026-01-08', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 5, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's78', startDate: '2026-01-05', endDate: '2026-01-08', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's79', startDate: '2026-01-05', endDate: '2026-01-08', time: '09:00 AM - 05:00 PM', timezone: 'SGT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's80', startDate: '2026-01-12', endDate: '2026-01-15', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's81', startDate: '2026-01-12', endDate: '2026-01-15', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '21',
    code: 'SFWIPF 1.0',
    title: 'Securing Networks with Cisco Firepower (SFWIPF)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4495,
    clcCredits: 40,
    category: 'Security',
    description: 'Deploy and manage Cisco Firepower NGFW and IPS solutions.',
    examCode: '300-710',
    prerequisites: ['SCOR certification or equivalent'],
    schedules: [
      { id: 's82', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 4, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's83', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 4, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's84', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 5, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's85', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 4, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '22',
    code: 'ENSLD 2.0',
    title: 'Designing Cisco Enterprise Networks (ENSLD)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4295,
    clcCredits: 40,
    category: 'Enterprise Networking',
    description: 'Design enterprise networks including LAN, WAN, and network services.',
    examCode: '300-420',
    prerequisites: ['CCNA certification', 'ENCOR or equivalent'],
    schedules: [
      { id: 's86', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's87', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's88', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's89', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '23',
    code: 'DCACI 1.2',
    title: 'Implementing Cisco Application Centric Infrastructure (DCACI)',
    level: 'Specialist',
    duration: '5 Days',
    price: 4495,
    clcCredits: 40,
    category: 'Data Center',
    description: 'Implement Cisco ACI fabric, policies, and integrations.',
    examCode: '300-620',
    prerequisites: ['DCCOR certification or equivalent'],
    schedules: [
      { id: 's90', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's91', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's92', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's93', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
  {
    id: '24',
    code: 'CCFND 1.0',
    title: 'Cloud Collaboration Foundation (CCFND)',
    level: 'Associate',
    duration: '5 Days',
    price: 2995,
    clcCredits: 40,
    category: 'Collaboration',
    description: 'Learn cloud collaboration fundamentals including Webex and contact center.',
    examCode: 'N/A',
    prerequisites: ['Basic networking knowledge'],
    schedules: [
      { id: 's94', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 5, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's95', startDate: '2026-01-05', endDate: '2026-01-09', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's96', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'IST', mode: 'Live Online', seatsLeft: 5, instructor: 'CCSI Instructor', guaranteed: true },
      { id: 's97', startDate: '2026-01-12', endDate: '2026-01-16', time: '09:00 AM - 05:00 PM', timezone: 'AEDT', mode: 'Live Online', seatsLeft: 6, instructor: 'CCSI Instructor', guaranteed: true },
    ]
  },
];

// Certification Path Data
const certificationPaths = [
  {
    level: 'Associate',
    color: '#00C853',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    certifications: ['CCNA', 'DevNet Associate'],
    description: 'Foundation level - Start your networking career',
    duration: '5-day courses',
    icon: GraduationCap,
  },
  {
    level: 'Professional',
    color: '#0694D1',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    certifications: ['CCNP Enterprise', 'CCNP Security', 'CCNP Data Center', 'DevNet Professional'],
    description: 'Advanced skills for senior network roles',
    duration: '5-day courses',
    icon: Award,
  },
  {
    level: 'Expert',
    color: '#B8860B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    certifications: ['CCIE Enterprise', 'CCIE Security', 'CCIE Data Center'],
    description: 'Industry-recognized expert level',
    duration: '8-day lab preparation',
    icon: Star,
  },
];

// Stats
const stats = [
  { value: '32+', label: 'Years Experience', icon: Award },
  { value: '500+', label: 'Reviews (4.7)', icon: Star },
  { value: '60+', label: 'Countries Served', icon: Globe },
  { value: '100K+', label: 'Professionals Trained', icon: Users },
];

// Learning Modes
const learningModes = [
  { icon: Video, title: 'Live Online', description: 'Interactive virtual classrooms with real-time instruction', color: '#0694D1' },
  { icon: Building2, title: 'Classroom', description: 'In-person training at our global centers', color: '#00C853' },
  { icon: Users, title: '1-on-1 Training', description: 'Personalized sessions tailored to your needs', color: '#FFB300' },
  { icon: Globe, title: 'Fly-Me-A-Trainer', description: 'Expert trainers at your location worldwide', color: '#FF6B35' },
];

// Helper Functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case 'Associate': return 'badge-associate';
    case 'Professional': return 'badge-professional';
    case 'Expert': return 'badge-expert';
    case 'Specialist': return 'badge-specialist';
    default: return 'badge-professional';
  }
};

// Lead Form Modal Component
const LeadFormModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={28} className="text-[#0694D1]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Talk to an Advisor</h3>
              <p className="text-gray-500 text-sm">
                Get personalized guidance on the right Cisco certification path for your career goals.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="input"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
              />

              <select className="input text-gray-500" required>
                <option value="">Which certification interests you?</option>
                <option value="ccna">CCNA - Getting Started</option>
                <option value="ccnp-enterprise">CCNP Enterprise</option>
                <option value="ccnp-security">CCNP Security</option>
                <option value="ccnp-datacenter">CCNP Data Center</option>
                <option value="ccie">CCIE Certification</option>
                <option value="devnet">DevNet (Automation)</option>
                <option value="not-sure">Not sure yet</option>
              </select>

              <select className="input text-gray-500">
                <option value="">When are you looking to train?</option>
                <option value="immediate">Within 2 weeks</option>
                <option value="1month">Within 1 month</option>
                <option value="3months">Within 3 months</option>
                <option value="exploring">Just exploring options</option>
              </select>

              <button type="submit" className="btn-primary w-full text-lg py-4">
                Get Free Consultation
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              We&apos;ll get back to you within 2 hours during business hours
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom Batch Request Modal Component
const CustomBatchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Custom Training</h3>
              <p className="text-gray-500 text-sm">
                Get a dedicated batch for your team with flexible scheduling, classroom, or 1-on-1 options.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="input"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
              />

              <select className="input text-gray-500" required>
                <option value="">Preferred Training Mode</option>
                <option value="classroom">Classroom Training (In-person)</option>
                <option value="1on1">1-on-1 Training (Dedicated Instructor)</option>
                <option value="private-vilt">Private Virtual Batch (Team only)</option>
                <option value="fly-trainer">Fly-Me-A-Trainer (At your location)</option>
              </select>

              <select className="input text-gray-500" required>
                <option value="">Number of Participants</option>
                <option value="1">Just me (1-on-1)</option>
                <option value="2-5">2-5 participants</option>
                <option value="6-10">6-10 participants</option>
                <option value="10+">10+ participants</option>
              </select>

              <input
                type="text"
                placeholder="Which course(s) are you interested in?"
                className="input"
              />

              <button type="submit" className="btn-primary w-full text-lg py-4">
                Request Custom Quote
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              We&apos;ll create a customized training plan within 24 hours
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Network Animation Component - Subtle, engaging visual for Cisco learners
const NetworkVisualization = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/30" />

      {/* Animated network nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0694D1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Network connection lines */}
        <motion.line
          x1="10" y1="20" x2="40" y2="35"
          stroke="url(#lineGradient)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.line
          x1="40" y1="35" x2="70" y2="25"
          stroke="url(#lineGradient)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        <motion.line
          x1="70" y1="25" x2="90" y2="45"
          stroke="url(#lineGradient)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
        />
        <motion.line
          x1="20" y1="60" x2="50" y2="50"
          stroke="url(#lineGradient)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.line
          x1="50" y1="50" x2="80" y2="70"
          stroke="url(#lineGradient)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
        />
      </svg>

      {/* Subtle floating network icons - Professional, monochromatic blue */}
      <motion.div
        className="absolute top-[18%] left-[8%] text-[#0694D1]/[0.08]"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Router size={28} />
      </motion.div>
      <motion.div
        className="absolute top-[22%] right-[10%] text-[#0694D1]/[0.08]"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield size={26} />
      </motion.div>
      <motion.div
        className="absolute bottom-[32%] left-[12%] text-[#0694D1]/[0.06]"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Server size={22} />
      </motion.div>
      <motion.div
        className="absolute bottom-[28%] right-[15%] text-[#0694D1]/[0.08]"
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud size={24} />
      </motion.div>
    </div>
  );
};

// Top Contact Strip - Matching Koenig's style
const TopStrip = () => {
  return (
    <div className="bg-[#0694D1] text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-6">
          <a href="https://wa.me/917042593729" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
            <MessageCircle size={14} />
            <span className="hidden sm:inline">+91-704-259-3729 (Chat)</span>
          </a>
          <a href="mailto:info@koenig-solutions.com" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
            <Mail size={14} />
            <span className="hidden sm:inline">info@koenig-solutions.com</span>
          </a>
        </div>
        <div className="flex items-center gap-2 text-blue-100">
          <Zap size={14} />
          <span className="text-xs sm:text-sm">Use Cisco Learning Credits (CLCs) for training</span>
        </div>
      </div>
    </div>
  );
};

// Header Component - Matching Koenig's style
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 left-0 right-0 z-50">
      <TopStrip />
      <header
        className={`transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="https://www.koenig-solutions.com" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0694D1] to-[#0576A8] flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <div className="text-gray-800 font-bold text-lg tracking-tight">KOENIG</div>
                <div className="text-[9px] text-gray-500 font-medium tracking-wider">SOLUTIONS</div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#schedule" className="text-gray-700 hover:text-[#0694D1] transition-colors text-sm font-medium">Schedule</a>
              <a href="#paths" className="text-gray-700 hover:text-[#0694D1] transition-colors text-sm font-medium">Certifications</a>
              <a href="#enterprise" className="text-gray-700 hover:text-[#0694D1] transition-colors text-sm font-medium">Enterprise</a>
              <a href="https://www.koenig-solutions.com/learning-options" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#0694D1] transition-colors text-sm font-medium">Learning Options</a>
              <a href="https://www.koenig-solutions.com/about-us" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#0694D1] transition-colors text-sm font-medium">About Koenig</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+16048251567" className="flex items-center gap-2 text-gray-600 hover:text-[#0694D1] transition-colors text-sm">
                <Phone size={14} />
                <span>+1 (604) 825-1567</span>
              </a>
              <a href="#schedule" className="btn-primary text-sm px-4 py-2">
                View Schedule
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#schedule" className="block text-gray-700 py-2 font-medium">Schedule</a>
                <a href="#paths" className="block text-gray-700 py-2 font-medium">Certifications</a>
                <a href="#enterprise" className="block text-gray-700 py-2 font-medium">Enterprise</a>
                <a href="https://www.koenig-solutions.com/learning-options" className="block text-gray-700 py-2 font-medium">Learning Options</a>
                <a href="https://www.koenig-solutions.com/about-us" className="block text-gray-700 py-2 font-medium">About Koenig</a>
                <div className="pt-4 border-t border-gray-100">
                  <a href="tel:+16048251567" className="flex items-center gap-2 text-gray-600 mb-4">
                    <Phone size={16} />
                    <span>+1 (604) 825-1567</span>
                  </a>
                  <a href="#schedule" className="btn-primary w-full text-center">View Schedule</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

// Hero Section
const HeroSection = ({ onOpenLeadForm }: { onOpenLeadForm: () => void }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-8 overflow-hidden">
      <NetworkVisualization />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cisco Platinum Partner Badge - Prominent */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#0694D1]/10 to-[#049FD9]/10 border-2 border-[#0694D1]/30 rounded-full mb-6">
              <div className="w-10 h-10 rounded-full bg-[#0694D1] flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <div className="text-[#0694D1] font-bold text-sm tracking-wide">CISCO PLATINUM</div>
                <div className="text-gray-600 text-xs">Learning Partner 2024</div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Master Cisco
              <span className="block text-[#0694D1]">Networking</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Expert-led CCNA, CCNP, and CCIE certification training with flexible scheduling,
              hands-on labs, and guaranteed exam readiness.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#schedule" className="btn-primary text-lg px-8 py-4">
                <Calendar size={20} />
                View Training Schedule
              </a>
              <button onClick={onOpenLeadForm} className="btn-secondary text-lg px-8 py-4">
                <MessageCircle size={20} />
                Talk to an Advisor
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Guaranteed to Run</div>
                  <div className="text-xs text-gray-500">All scheduled dates</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard size={20} className="text-[#0694D1]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">CLCs Accepted</div>
                  <div className="text-xs text-gray-500">Cisco Learning Credits</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <stat.icon size={28} className="text-[#0694D1] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle gradient accent at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px accent-gradient" />
    </section>
  );
};

// Certification Pathway Section
const CertificationPathway = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="paths" ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-divider" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Certification Pathway
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Progress through Cisco&apos;s certification levels and unlock higher-paying career opportunities
          </p>
        </motion.div>

        {/* Path Cards with connector */}
        <div className="relative">
          {/* Connector Line - Desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-amber-400 -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {certificationPaths.map((path, index) => (
              <motion.div
                key={path.level}
                className={`card p-8 text-center ${path.bgColor} border ${path.borderColor} relative`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
              >
                {/* Level Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                  style={{ borderColor: path.color, backgroundColor: `${path.color}15` }}
                >
                  <path.icon size={28} style={{ color: path.color }} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.level}</h3>
                <p className="text-gray-500 text-sm mb-4">{path.description}</p>

                {/* Certifications */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {path.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white"
                      style={{ color: path.color, border: `1px solid ${path.color}30` }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Duration info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Clock size={16} style={{ color: path.color }} />
                    <span className="text-sm font-medium">{path.duration}</span>
                  </div>
                </div>

                {/* Arrow connector for desktop */}
                {index < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-5 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center -translate-y-1/2 z-20">
                    <ArrowRight size={18} className="text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Date Filter Helper Functions
const getDateRangeLabel = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const getQuickDateRange = (option: string): { start: Date; end: Date } | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (option) {
    case 'This Week': {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      return { start: today, end: endOfWeek };
    }
    case 'Next Week': {
      const startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()) + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return { start: startOfNextWeek, end: endOfNextWeek };
    }
    case 'This Month': {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: today, end: endOfMonth };
    }
    case 'Next Month': {
      const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      return { start: startOfNextMonth, end: endOfNextMonth };
    }
    case 'Jan 2026': {
      return { start: new Date('2026-01-01'), end: new Date('2026-01-31') };
    }
    case 'Feb 2026': {
      return { start: new Date('2026-02-01'), end: new Date('2026-02-28') };
    }
    default:
      return null;
  }
};

// Schedule Section
const ScheduleSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showCustomRequestModal, setShowCustomRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Dates');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedTimezone, setSelectedTimezone] = useState('All');
  const [selectedCLCRange, setSelectedCLCRange] = useState('All');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = ['All', 'Enterprise Networking', 'Security', 'Data Center', 'DevNet', 'Service Provider', 'Collaboration'];
  const levels = ['All', 'Associate', 'Professional', 'Expert', 'Specialist'];
  const dateQuickFilters = ['All Dates', 'Jan 2026', 'Feb 2026'];
  const durations = ['All', '3 Days', '4 Days', '5 Days', '8 Days'];
  const timezones = ['All', 'IST', 'AEDT'];
  const clcRanges = ['All', '24-32 CLCs', '40 CLCs', '48-64 CLCs'];
  // Only showing Live Online in filters since all current batches are VILT
  // Classroom and 1-on-1 available on request

  // Check if a course has schedules within the selected date range
  const courseMatchesDateFilter = (course: Course): boolean => {
    if (selectedDateFilter === 'All Dates' && !customDateStart && !customDateEnd) {
      return true;
    }

    let filterStart: Date | null = null;
    let filterEnd: Date | null = null;

    if (customDateStart && customDateEnd) {
      filterStart = new Date(customDateStart);
      filterEnd = new Date(customDateEnd);
    } else if (selectedDateFilter !== 'All Dates') {
      const range = getQuickDateRange(selectedDateFilter);
      if (range) {
        filterStart = range.start;
        filterEnd = range.end;
      }
    }

    if (!filterStart || !filterEnd) return true;

    return course.schedules.some(schedule => {
      const scheduleStart = new Date(schedule.startDate);
      return scheduleStart >= filterStart! && scheduleStart <= filterEnd!;
    });
  };

  // Check if course matches duration filter
  const courseMatchesDuration = (course: Course): boolean => {
    if (selectedDuration === 'All') return true;
    return course.duration === selectedDuration;
  };

  // Check if course has schedules in selected timezone
  const courseMatchesTimezone = (course: Course): boolean => {
    if (selectedTimezone === 'All') return true;
    return course.schedules.some(schedule => schedule.timezone === selectedTimezone);
  };

  // Check if course matches CLC range
  const courseMatchesCLCRange = (course: Course): boolean => {
    if (selectedCLCRange === 'All') return true;
    const clc = course.clcCredits;
    switch (selectedCLCRange) {
      case '24-32 CLCs': return clc >= 24 && clc <= 32;
      case '40 CLCs': return clc === 40;
      case '48-64 CLCs': return clc >= 48 && clc <= 64;
      default: return true;
    }
  };

  const filteredCourses = ciscoCoursesData.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = courseMatchesDateFilter(course);
    const matchesDuration = courseMatchesDuration(course);
    const matchesTimezone = courseMatchesTimezone(course);
    const matchesCLC = courseMatchesCLCRange(course);
    return matchesCategory && matchesLevel && matchesSearch && matchesDate && matchesDuration && matchesTimezone && matchesCLC;
  });

  const clearDateFilter = () => {
    setSelectedDateFilter('All Dates');
    setCustomDateStart('');
    setCustomDateEnd('');
    setShowDatePicker(false);
  };

  return (
    <section id="schedule" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="section-divider" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Training Schedule
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find your perfect training date. All courses include hands-on labs and exam preparation.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search courses (e.g., CCNA, ENCOR, Security...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-ghost ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Level:</span>
              <div className="tab-nav">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`tab-item ${selectedLevel === level ? 'active' : ''}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Training Request */}
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-gray-500">Need classroom or 1-on-1 training?</span>
              <button
                onClick={() => setShowCustomRequestModal(true)}
                className="text-[#0694D1] font-medium hover:underline"
              >
                Request Custom Batch
              </button>
            </div>
          </div>

          {/* Date Filter Row */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-500 text-sm">When are you free?</span>
            </div>

            {/* Quick Date Filters */}
            <div className="flex flex-wrap gap-2">
              {dateQuickFilters.map((dateOption) => (
                <button
                  key={dateOption}
                  onClick={() => {
                    setSelectedDateFilter(dateOption);
                    setCustomDateStart('');
                    setCustomDateEnd('');
                    setShowDatePicker(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedDateFilter === dateOption && !customDateStart
                      ? 'bg-[#0694D1] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dateOption}
                </button>
              ))}

              {/* Custom Date Range Button */}
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  customDateStart && customDateEnd
                    ? 'bg-[#0694D1] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar size={14} />
                {customDateStart && customDateEnd
                  ? `${new Date(customDateStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(customDateEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : 'Pick Dates'
                }
              </button>

              {/* Clear Filter */}
              {(selectedDateFilter !== 'All Dates' || customDateStart) && (
                <button
                  onClick={clearDateFilter}
                  className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Custom Date Picker Dropdown */}
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={customDateStart}
                        onChange={(e) => {
                          setCustomDateStart(e.target.value);
                          setSelectedDateFilter('Custom');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0694D1] focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={customDateEnd}
                        onChange={(e) => {
                          setCustomDateEnd(e.target.value);
                          setSelectedDateFilter('Custom');
                        }}
                        min={customDateStart}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0694D1] focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 bg-[#0694D1] text-white text-sm font-medium rounded-lg hover:bg-[#0576A8] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional Filters Row */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            {/* Duration Filter */}
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-500 text-sm">Duration:</span>
              <div className="flex flex-wrap gap-1">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedDuration === duration
                        ? 'bg-[#0694D1] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone Filter */}
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-gray-400" />
              <span className="text-gray-500 text-sm">Timezone:</span>
              <div className="flex flex-wrap gap-1">
                {timezones.map((tz) => (
                  <button
                    key={tz}
                    onClick={() => setSelectedTimezone(tz)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTimezone === tz
                        ? 'bg-[#0694D1] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tz}
                  </button>
                ))}
              </div>
            </div>

            {/* CLC Range Filter */}
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-gray-500 text-sm">CLCs:</span>
              <div className="flex flex-wrap gap-1">
                {clcRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedCLCRange(range)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCLCRange === range
                        ? 'bg-[#0694D1] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All Filters */}
            {(selectedDuration !== 'All' || selectedTimezone !== 'All' || selectedCLCRange !== 'All') && (
              <button
                onClick={() => {
                  setSelectedDuration('All');
                  setSelectedTimezone('All');
                  setSelectedCLCRange('All');
                }}
                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                <X size={12} />
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Course List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                className={`course-card ${expandedCourse === course.id ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Course Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`badge ${getLevelBadgeClass(course.level)}`}>
                          {course.level}
                        </span>
                        <span className="font-mono text-sm text-[#0694D1] font-semibold">{course.code}</span>
                        {course.examCode && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Exam: {course.examCode}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Duration</div>
                        <div className="text-gray-800 font-semibold flex items-center gap-1">
                          <Clock size={14} className="text-[#0694D1]" />
                          {course.duration}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">CLC Credits</div>
                        <div className="clc-badge">
                          <CreditCard size={14} />
                          {course.clcCredits}
                        </div>
                      </div>

                      <div className="text-center hidden lg:block">
                        <div className="text-xs text-gray-400 mb-1">Sessions</div>
                        <div className="text-gray-800 font-semibold">{course.schedules.length} available</div>
                      </div>

                      <ChevronDown
                        size={24}
                        className={`text-[#0694D1] transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Schedule */}
                <AnimatePresence>
                  {expandedCourse === course.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6 bg-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar size={18} className="text-[#0694D1]" />
                          <h4 className="text-gray-900 font-semibold">Upcoming Sessions</h4>
                        </div>

                        <div className="grid gap-3">
                          {course.schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#0694D1] hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-4">
                                {/* Date Display */}
                                <div className="date-display min-w-[90px]">
                                  <div className="month">{formatDate(schedule.startDate).split(' ')[0]}</div>
                                  <div className="day">{formatDate(schedule.startDate).split(' ')[1]}</div>
                                </div>

                                {/* Details */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                                    <Clock size={14} className="text-[#0694D1]" />
                                    {schedule.time} ({schedule.timezone})
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {schedule.mode === 'Live Online' && <Monitor size={14} />}
                                    {schedule.mode === 'Classroom' && <Building2 size={14} />}
                                    {schedule.mode === '1-on-1' && <Users size={14} />}
                                    {schedule.mode}
                                    {schedule.location && ` - ${schedule.location}`}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Instructor: {schedule.instructor}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                {/* Status Badges */}
                                <div className="flex items-center gap-2">
                                  {schedule.guaranteed && (
                                    <span className="badge badge-guaranteed">
                                      <CheckCircle size={12} />
                                      Guaranteed
                                    </span>
                                  )}
                                  {schedule.seatsLeft <= 5 && (
                                    <span className="badge badge-limited">
                                      {schedule.seatsLeft} seats left
                                    </span>
                                  )}
                                  {schedule.seatsLeft > 5 && (
                                    <span className="text-sm text-gray-500">{schedule.seatsLeft} seats available</span>
                                  )}
                                </div>

                                {/* Enroll Button */}
                                <button className="btn-primary text-sm px-6 py-2">
                                  Enroll Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Request Custom Date */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Don&apos;t see a date that works for you?</span>
                          <button className="text-[#0694D1] text-sm font-medium hover:underline flex items-center gap-1">
                            Request Custom Schedule <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 card">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No courses match your filters. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>

        {/* Custom Batch Modal */}
        <CustomBatchModal isOpen={showCustomRequestModal} onClose={() => setShowCustomRequestModal(false)} />
      </div>
    </section>
  );
};

// Learning Modes Section - Updated to focus on premium options
const LearningModesSection = ({ onRequestCustom }: { onRequestCustom: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="section-divider" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Training Options for Every Need
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our scheduled batches run as Live Online (VILT). Need something different? We offer premium options for teams and individuals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Live Online - Highlighted as default */}
          <motion.div
            className="card p-6 text-center border-2 border-[#0694D1] relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0694D1] text-white text-xs px-3 py-1 rounded-full font-medium">
              Most Popular
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-blue-50">
              <Video size={32} className="text-[#0694D1]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Online (VILT)</h3>
            <p className="text-gray-500 text-sm mb-4">Interactive virtual classrooms with real-time instruction</p>
            <a href="#schedule" className="text-[#0694D1] text-sm font-medium hover:underline">
              View Schedule →
            </a>
          </motion.div>

          {/* Other modes - Available on request */}
          {[
            { icon: Building2, title: 'Classroom', description: 'In-person training at our global centers', color: '#00C853', tag: 'On Request' },
            { icon: Users, title: '1-on-1 Training', description: 'Dedicated instructor for personalized learning', color: '#FFB300', tag: 'Premium' },
            { icon: Globe, title: 'Fly-Me-A-Trainer', description: 'Expert trainers at your location worldwide', color: '#FF6B35', tag: 'Enterprise' },
          ].map((mode, index) => (
            <motion.div
              key={mode.title}
              className="card p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: (index + 1) * 0.1 }}
              onClick={onRequestCustom}
            >
              <div className="absolute top-3 right-3 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                {mode.tag}
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${mode.color}15` }}
              >
                <mode.icon size={32} style={{ color: mode.color }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{mode.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{mode.description}</p>
              <span className="text-[#0694D1] text-sm font-medium group-hover:underline">
                Request Quote →
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA for custom training */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4">Have a team that needs training? We can create a custom batch just for you.</p>
          <button onClick={onRequestCustom} className="btn-secondary">
            <Users size={18} />
            Request Custom Training
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// CLC Section
const CLCSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="enterprise" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="clc-badge mb-6">
              <CreditCard size={16} />
              <span>Cisco Learning Credits Accepted</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Master Cisco Certification
            </h2>
            <h3 className="text-2xl lg:text-3xl font-semibold text-[#0694D1] mb-6">
              Through Cisco Learning Credits
            </h3>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              As a Cisco Platinum Learning Partner, Koenig Solutions accepts Cisco Learning Credits (CLCs)
              for all authorized Cisco courses. Maximize your training investment with prepaid credits.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Use CLCs to pay for any Cisco authorized course',
                'Valid for 1 year from issue date',
                'Use for ILT, virtual, or on-demand training',
                'Team Captain approval workflow supported'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary">
                <CreditCard size={18} />
                Redeem CLCs Now
              </button>
              <button className="btn-secondary">
                <BookOpen size={18} />
                How CLCs Work
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-elevated p-8 relative overflow-hidden">
              {/* Premium indicator */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0694D1] to-[#049FD9] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg">
                Priority Response
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0694D1] to-[#0576A8] flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                Enterprise Training
              </h3>
              <p className="text-gray-500 text-sm mb-6">Get a customized training proposal for your team</p>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="input"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Work Email"
                  className="input"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="input"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input"
                  />
                </div>

                <select className="input text-gray-500" required>
                  <option value="">Team Size</option>
                  <option value="2-5">2-5 learners</option>
                  <option value="6-10">6-10 learners</option>
                  <option value="11-25">11-25 learners</option>
                  <option value="26-50">26-50 learners</option>
                  <option value="50+">50+ learners</option>
                </select>

                <select className="input text-gray-500">
                  <option value="">Payment Method</option>
                  <option value="clc">Cisco Learning Credits (CLCs)</option>
                  <option value="direct">Direct Payment / Invoice</option>
                  <option value="po">Purchase Order</option>
                </select>

                <textarea
                  placeholder="Which courses or certifications are you interested in? (Optional)"
                  className="input min-h-[80px] resize-none"
                  rows={3}
                />

                <button type="submit" className="btn-primary w-full text-lg py-4 group">
                  <span>Get Custom Quote</span>
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>24hr Response</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>CLCs Accepted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Why Koenig Section
const WhyKoenigSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reasons = [
    {
      icon: Award,
      title: 'Platinum Cisco Partner',
      description: 'Official Cisco authorization ensures curriculum accuracy and exam alignment'
    },
    {
      icon: BadgeCheck,
      title: 'Certified Instructors',
      description: 'All trainers are Cisco Certified Systems Instructors (CCSIs)'
    },
    {
      icon: Target,
      title: 'Hands-on Labs',
      description: 'Practice on real Cisco equipment and simulated network environments'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Post-training support and exam preparation guidance included'
    },
    {
      icon: TrendingUp,
      title: 'Success Guarantee',
      description: 'Our Happiness Guarantee ensures your training investment is protected'
    },
    {
      icon: Globe,
      title: 'Global Delivery',
      description: 'Training available across multiple time zones and locations worldwide'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="section-divider" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Train With Koenig
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            31 years of excellence in IT training, trusted by professionals in 60+ countries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              className="card p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <reason.icon size={24} className="text-[#0694D1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-gray-500">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = ({ onOpenLeadForm }: { onOpenLeadForm: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 hero-pattern relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Advance Your Cisco Career?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of IT professionals who have accelerated their careers with Koenig&apos;s
            expert-led Cisco certification training.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="#schedule" className="btn-primary text-lg px-10 py-4">
              <Calendar size={20} />
              Browse Schedule
            </a>
            <button onClick={onOpenLeadForm} className="btn-secondary text-lg px-10 py-4">
              <MessageCircle size={20} />
              Talk to an Advisor
            </button>
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap justify-center gap-8">
            <a href="tel:+18046251567" className="flex items-center gap-2 text-gray-600 hover:text-[#0694D1] transition-colors">
              <Phone size={18} className="text-[#0694D1]" />
              <span>+1 (604) 825-1567</span>
            </a>
            <a href="mailto:info@koenig-solutions.com" className="flex items-center gap-2 text-gray-600 hover:text-[#0694D1] transition-colors">
              <Mail size={18} className="text-[#0694D1]" />
              <span>info@koenig-solutions.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer - Matching Koenig's professional style
const Footer = () => {
  const globalOffices = [
    { country: 'USA', city: 'New York', phone: '+1 (604) 825-1567', address: '477 Madison Avenue, 6th floor, New York City, NY 10022' },
    { country: 'India', city: 'New Delhi', phone: '+91 8095-073-333', address: 'B-39, Plot No. 70, KLJ Complex-1, Moti Nagar, New Delhi 110015' },
    { country: 'UK', city: 'London', phone: '+44 7786 378779', address: 'Level 17, Dashwood House, 69 Old Broad Street, London EC2M 1QS' },
    { country: 'UAE', city: 'Dubai', phone: '+971 524 856 717', address: 'Block 3, Office G10, Dubai Knowledge, Dubai 503220' },
    { country: 'Australia', city: 'Sydney', phone: '+61 2 9099 5670', address: 'Level 12, 95 Pitt Street, Sydney, NSW 2000' },
    { country: 'Canada', city: 'Vancouver', phone: '+1 (604) 825-1567', address: '#1608-271 Francis Way, New Westminster, BC V3L0H2' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Partner Badges Section */}
      <div className="border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Award size={20} className="text-[#0694D1]" />
              <span className="text-sm">Cisco Platinum Learning Partner</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star size={20} className="text-amber-400" />
              <span className="text-sm">32+ Years of Excellence</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Globe size={20} className="text-green-500" />
              <span className="text-sm">60+ Countries Served</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0694D1] to-[#0576A8] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">KOENIG SOLUTIONS</div>
                  <div className="text-xs text-gray-500">Pvt. Ltd.</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-sm">
                World&apos;s leading IT training company. Official Cisco Platinum Learning Partner offering authorized certification training globally.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">4.7/5 (500+ reviews)</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <a href="https://www.facebook.com/koenigsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#0694D1]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com/koikisolve" target="_blank" rel="noopener noreferrer" className="hover:text-[#0694D1]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/koenig-solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#0694D1]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.youtube.com/user/koikisolve" target="_blank" rel="noopener noreferrer" className="hover:text-[#0694D1]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Cisco Courses */}
            <div>
              <h4 className="text-white font-semibold mb-4">Cisco Courses</h4>
              <ul className="space-y-2">
                {['CCNA Training', 'CCNP Enterprise', 'CCNP Security', 'CCNP Data Center', 'CCIE Enterprise', 'DevNet Associate'].map((item) => (
                  <li key={item}>
                    <a href="#schedule" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#schedule" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">Training Schedule</a></li>
                <li><a href="#enterprise" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">Enterprise Training</a></li>
                <li><a href="#enterprise" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">CLC Redemption</a></li>
                <li><a href="https://www.koenig-solutions.com/learning-options" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">Learning Options</a></li>
                <li><a href="https://www.koenig-solutions.com/about-us" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">About Us</a></li>
                <li><a href="https://www.koenig-solutions.com/student-feedback" className="text-gray-400 hover:text-[#0694D1] transition-colors text-sm">Student Feedback</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@koenig-solutions.com" className="flex items-center gap-2 text-gray-400 hover:text-[#0694D1] transition-colors text-sm">
                    <Mail size={14} />
                    info@koenig-solutions.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/917042593729" className="flex items-center gap-2 text-gray-400 hover:text-[#0694D1] transition-colors text-sm">
                    <MessageCircle size={14} />
                    WhatsApp Chat
                  </a>
                </li>
              </ul>
              <h4 className="text-white font-semibold mt-6 mb-3">Call Us</h4>
              <ul className="space-y-2">
                {[
                  { region: 'USA/Canada', phone: '+1 (604) 825-1567' },
                  { region: 'India', phone: '+91 8095-073-333' },
                  { region: 'UK', phone: '+44 7786 378779' },
                  { region: 'UAE', phone: '+971 524 856 717' },
                ].map((item) => (
                  <li key={item.region}>
                    <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-white transition-colors text-xs">
                      <span className="text-gray-500">{item.region}:</span> {item.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Koenig Solutions Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="https://www.koenig-solutions.com/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="https://www.koenig-solutions.com/terms-of-use" className="text-gray-500 hover:text-white transition-colors">Terms of Use</a>
              <span className="text-gray-700">|</span>
              <a href="https://www.koenig-solutions.com/refund-policy" className="text-gray-500 hover:text-white transition-colors">Refund Policy</a>
              <span className="text-gray-700">|</span>
              <a href="https://www.koenig-solutions.com/happiness-guarantee" className="text-gray-500 hover:text-white transition-colors">Happiness Guarantee</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Floating WhatsApp Button
const FloatingContact = () => {
  return (
    <a
      href="https://wa.me/917042593729"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-btn"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

// Main Page Component
export default function CiscoTrainingLanding() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isCustomBatchModalOpen, setIsCustomBatchModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection onOpenLeadForm={() => setIsLeadFormOpen(true)} />
      <CertificationPathway />
      <ScheduleSection />
      <LearningModesSection onRequestCustom={() => setIsCustomBatchModalOpen(true)} />
      <CLCSection />
      <WhyKoenigSection />
      <CTASection onOpenLeadForm={() => setIsLeadFormOpen(true)} />
      <Footer />
      <FloatingContact />
      <LeadFormModal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
      <CustomBatchModal isOpen={isCustomBatchModalOpen} onClose={() => setIsCustomBatchModalOpen(false)} />
    </main>
  );
}
