import React from 'react';
import { Users, UserCheck, Clock, DollarSign, Building2 } from 'lucide-react';

const StatsCards = ({ stats = {} }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const cards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees ?? 0,
      sub: 'All records',
      icon: Users,
      highlight: '#facc15'
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees ?? 0,
      sub: 'Currently working',
      icon: UserCheck,
      highlight: '#22c55e'
    },
    {
      title: 'On Leave',
      value: stats.onLeaveEmployees ?? 0,
      sub: 'Temporary absence',
      icon: Clock,
      highlight: '#f59e0b'
    },
    {
      title: 'Average Salary',
      value: formatCurrency(stats.averageSalary),
      sub: `Total: ${formatCurrency(stats.totalPayroll)}`,
      icon: DollarSign,
      highlight: '#facc15'
    },
    {
      title: 'Departments',
      value: stats.departmentsCount ?? 0,
      sub: 'Active units',
      icon: Building2,
      highlight: '#eab308'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#141419',
              border: '1px solid #252530',
              borderRadius: '10px',
              padding: '1.15rem 1.25rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: card.highlight
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#9e9eb0',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {card.title}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(250, 204, 21, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.highlight
              }}>
                <IconComponent size={18} />
              </div>
            </div>

            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.25rem'
            }}>
              {card.value}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: '#767682'
            }}>
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
