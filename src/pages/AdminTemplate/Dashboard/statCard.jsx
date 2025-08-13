import { Card, Statistic, Skeleton } from 'antd';

export default function StatCard({ loading, title, value, icon:Icon, color, bg, desc }) {
  return (
    <Card 
      hoverable 
      className="admin-stat-card" 
      styles={{
        body: { padding: 20 }
      }}
    >
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 120 }} />
      ) : (
        <>
          <Statistic
            title={<span style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>{title}</span>}
            value={value}
            prefix={<Icon style={{ backgroundColor: bg, padding: 8, borderRadius: 8, color }} />}
            valueStyle={{ color, fontSize: '28px', fontWeight: 'bold' }}
          />
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
            {desc}
          </div>
        </>
      )}
    </Card>
  );
}
