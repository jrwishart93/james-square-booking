import type { Metadata } from 'next';

import FactorInfoPage from '@/components/FactorInfoPage';
import GlassCard from '@/components/GlassCard';

export const metadata: Metadata = {
  title: 'Newton Property Management | James Square',
  description: 'Information for James Square owners about Newton Property Management factoring proposal.',
};

const NewtonPage = () => {
  return (
    <FactorInfoPage
      title="Newton Property Management"
      subtitle="Information for James Square owners"
      intro="Newton Property Management is an established Scottish property factor operating across multiple regions, including Edinburgh, Glasgow, Aberdeen, and Inverness. Newton manages a range of residential developments, including large and complex sites with shared facilities."
      introContent={
        <GlassCard title="Newton Factoring Cost Breakdown" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            This table reproduces the figures provided by Newton exactly as submitted and has not been recalculated or
            adjusted.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Address / block</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Total costs</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 39 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 45 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 51 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 55 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 57 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 59 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Block 61 – per unit</th>
                  <th className="border-b border-slate-200/80 py-2 dark:border-white/10">Block 65 – per unit</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Units per block</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">103</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">16</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">19</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">31</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">15</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">6</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">8</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">2</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Common cleaning</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£26,807.04</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£260.26</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£260.26</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Common window cleaning</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£585.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£5.68</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£5.68</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Common ground maintenance</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£6,800.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£66.02</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£66.02</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Emergency lights</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£950.40</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£7.43</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£6.25</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£3.83</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£7.92</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£19.80</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£19.80</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£14.85</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£59.40</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Dry risers</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,776.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£13.88</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£11.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£7.16</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£14.80</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£37.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£37.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£27.75</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£111.00</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">
                    Fire alarm panel &amp; sprinklers
                  </td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£3,600.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£22.50</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£18.95</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£11.61</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£24.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£60.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£60.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£45.00</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Lift maintenance</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,517.41</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£50.35</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£50.35</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Lift insurance</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£668.68</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£13.37</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£13.37</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">CCTV</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1.75</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£1.75</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Pool / sauna servicing</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9,242.62</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£89.73</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£89.73</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Caretaker &amp; payroll</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£57,408.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£557.36</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£557.36</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Lift telephone</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£600.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£12.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£12.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Landlord supply</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£28,000.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£271.84</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£271.84</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Ad-hoc repair budget</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£10,300.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£100.00</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£100.00</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Building insurance</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£38,730.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£376.02</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£376.02</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">
                    Directors and Officers insurance
                  </td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,000.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£9.71</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£9.71</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Newton management fee</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£18,540.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£180.00</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£180.00</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">TOTAL PER UNIT PER ANNUM</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,962.18</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,030.98</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,016.70</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£1,965.10</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,035.18</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,035.18</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£2,005.98</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£2,088.78</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">DD Discount</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£49.44</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–£49.44</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">
                    Recommended Direct Debit (rounded)
                  </td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£160.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£165.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£165.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£160.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£165.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£165.00</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">£165.00</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">£170.00</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">Optional e-billing discount</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 pr-4 dark:border-white/10">–£29.66</td>
                  <td className="border-b border-slate-200/80 py-2 dark:border-white/10">–£29.66</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Total with discounts</td>
                  <td className="py-2 pr-4">–</td>
                  <td className="py-2 pr-4">£1,883.08</td>
                  <td className="py-2 pr-4">£1,951.88</td>
                  <td className="py-2 pr-4">£1,937.60</td>
                  <td className="py-2 pr-4">£1,886.00</td>
                  <td className="py-2 pr-4">£1,956.08</td>
                  <td className="py-2 pr-4">£1,956.08</td>
                  <td className="py-2 pr-4">£1,926.88</td>
                  <td className="py-2">£2,009.68</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      }
      logoSrc="/images/logo/newton-logo-removebg-preview.png"
      logoAlt="Newton Property Management logo"
      managementTitle="How Newton would manage James Square"
      managementText="Newton Property Management operates a structured, systems-based factoring model with defined processes for reporting, escalation, and oversight. Management would be delivered through a named property manager supported by centralised systems designed to provide consistency and visibility across maintenance and compliance matters."
      communicationText="Maintenance issues would be logged, tracked, and assigned through Newton’s internal systems, with responsibility held by a named property manager. Progress would be monitored and escalated where required, with updates available to the committee as matters are progressed."
      costs={[
        { label: 'Total annual budget:', value: 'approximately £192,700' },
        { label: 'Approximate cost per flat:', value: 'around £1,870 per year (about £156 per month)' },
        { label: 'Management fee:', value: '£180 plus VAT per flat per year' },
        { label: 'Float required:', value: '£300 per flat (refundable)' },
        { label: 'Insurance:', value: 'potential savings identified' },
      ]}
      documentationLinks={[
        {
          href: '/images/venues/Newton-Tender-Doc.pdf',
          label: 'View Newton tender documentation (PDF)',
        },
        {
          href: '/images/venues/Newton-Cost-doc.pdf',
          label: 'View Newton cost breakdown (PDF)',
        },
      ]}
    />
  );
};

export default NewtonPage;
